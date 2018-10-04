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

import { Session } from "@brightside/imperative";
import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";
import { getResource, IResourceParms } from "../../../../../src";

let testEnvironment: ITestEnvironment;
let regionName: string;
let session: Session;

describe("CICS Get resource", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_get_resource",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        regionName = testEnvironment.systemTestProperties.cmci.regionName;
        const cmciProperties = await testEnvironment.systemTestProperties.cmci;

        session = new Session({
            user: cmciProperties.user,
            password: cmciProperties.password,
            hostname: cmciProperties.host,
            port: cmciProperties.port,
            type: "basic",
            strictSSL: false,
            protocol: "http",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(testEnvironment);
    });

    const options: IResourceParms = {} as any;

    it("should get a resource from CICS", async () => {
        let error;
        let response;

        options.name = "CICSProgram";
        options.regionName = regionName;

        try {
            response = await getResource(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
    });

    it("should get a resource from CICS using criteria", async () => {
        let error;
        let response;

        options.name = "CICSProgram";
        options.regionName = regionName;
        options.criteria = "program=D*";
        try {
            response = await getResource(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
    });

    it("should fail to define a resource to CICS with invalid CICS region", async () => {
        let error;
        let response;

        options.name = "CICSProgram";
        options.criteria = "program=D*";
        options.regionName = "FAKE";

        try {
            response = await getResource(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });
});
