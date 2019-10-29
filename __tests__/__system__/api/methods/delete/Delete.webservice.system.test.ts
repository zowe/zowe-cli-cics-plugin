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
import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";
import { generateRandomAlphaNumericString } from "../../../../__src__/TestUtils";
import { defineWebservice, deleteWebservice, IWebServiceParms } from "../../../../../src";

let testEnvironment: ITestEnvironment;
let regionName: string;
let csdGroup: string;
let session: Session;

describe("CICS Delete web service", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_delete_webservice",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = testEnvironment.systemTestProperties.cmci.csdGroup;
        regionName = testEnvironment.systemTestProperties.cmci.regionName;
        const cmciProperties = await testEnvironment.systemTestProperties.cmci;

        session = new Session({
            user: cmciProperties.user,
            password: cmciProperties.password,
            hostname: cmciProperties.host,
            port: cmciProperties.port,
            type: "basic",
            strictSSL: false,
            protocol: testEnvironment.systemTestProperties.cmci.protocol as any || "http",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(testEnvironment);
    });

    const options: IWebServiceParms = {
        pipelineName: "AAAA1234",
        wsBind: "/u/exampleapp/wsbind/example.log",
        validation: false
    } as any;

    it("should delete a web service from CICS", async () => {
        let error;
        let response;

        const webserviceNameSuffixLength = 4;
        const webserviceName = "AAAA" + generateRandomAlphaNumericString(webserviceNameSuffixLength);

        options.name = webserviceName;
        options.csdGroup = csdGroup;
        options.regionName = regionName;

        try {
            await defineWebservice(session, options);
            response = await deleteWebservice(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
    });

    it("should fail to delete a web service from CICS with invalid CICS region", async () => {
        let error;
        let response;

        const webserviceNameSuffixLength = 4;
        const webserviceName = "AAAA" + generateRandomAlphaNumericString(webserviceNameSuffixLength);

        options.name = webserviceName;
        options.csdGroup = csdGroup;
        options.regionName = "FAKE";

        try {
            response = await deleteWebservice(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });
});
