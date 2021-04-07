/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import { Session } from "@zowe/imperative";
import { ITestEnvironment, TestEnvironment } from "@zowe/cli-test-utils";
import { ITestPropertiesSchema } from "../../../../__src__/doc/ITestPropertiesSchema";
import { generateRandomAlphaNumericString } from "../../../../__src__/TestUtils";
import { defineWebservice, deleteWebservice, IWebServiceParms } from "../../../../../src";

let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let regionName: string;
let csdGroup: string;
let session: Session;

describe("CICS Define web service", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_define_webservice",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = testEnvironment.systemTestProperties.cmci.csdGroup;
        regionName = testEnvironment.systemTestProperties.cmci.regionName;
        const cicsProperties = testEnvironment.systemTestProperties.cics;

        session = new Session({
            user: cicsProperties.user,
            password: cicsProperties.password,
            hostname: cicsProperties.host,
            port: cicsProperties.port,
            type: "basic",
            rejectUnauthorized: cicsProperties.rejectUnauthorized || false,
            protocol: cicsProperties.protocol as any || "https",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(testEnvironment);
    });

    const options: IWebServiceParms = {} as any;

    it("should define a web service to CICS", async () => {
        let error;
        let response;

        const websvcNameSuffixLength = 4;
        const websvcName = "AAAA" + generateRandomAlphaNumericString(websvcNameSuffixLength);

        options.name = websvcName;
        options.pipelineName = "AAAA1234";
        options.wsBind = "/u/exampleapp/wsbind/example.log";
        options.validation = false;
        options.csdGroup = csdGroup;
        options.regionName = regionName;

        try {
            response = await defineWebservice(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await deleteWebservice(session, options);
    });

    it("should fail to define a web service to CICS with invalid CICS region", async () => {
        let error;
        let response;

        const websvcNameSuffixLength = 4;
        const websvcName = "AAAA" + generateRandomAlphaNumericString(websvcNameSuffixLength);

        options.name = websvcName;
        options.pipelineName = "AAAA1234";
        options.wsBind = "/u/exampleapp/wsbind/example.log";
        options.validation = false;
        options.csdGroup = csdGroup;
        options.regionName = "FAKE";

        try {
            response = await defineWebservice(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });

    it("should fail to define a web service to CICS due to duplicate name", async () => {
        let error;
        let response;

        const websvcNameSuffixLength = 4;
        const websvcName = "AAAA" + generateRandomAlphaNumericString(websvcNameSuffixLength);

        options.name = websvcName;
        options.pipelineName = "AAAA1234";
        options.wsBind = "/u/exampleapp/wsbind/example.log";
        options.validation = false;
        options.csdGroup = csdGroup;
        options.regionName = regionName;

        // define a web service to CICS
        try {
            response = await defineWebservice(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        response = null; // reset

        // define the same web service and validate duplicate error
        try {
            response = await defineWebservice(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("DUPRES");
        await deleteWebservice(session, options);
    });
});
