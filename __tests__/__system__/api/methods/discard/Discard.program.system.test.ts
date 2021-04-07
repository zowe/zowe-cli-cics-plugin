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
import { defineProgram, deleteProgram, discardProgram, installProgram, IProgramParms } from "../../../../../src";

let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let regionName: string;
let csdGroup: string;
let session: Session;

describe("CICS Discard program", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_discard_program",
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

    const options: IProgramParms = {} as any;

    it("should discard a program from CICS", async () => {
        let error;
        let response;

        const programNameSuffixLength = 4;
        const programName = "AAAA" + generateRandomAlphaNumericString(programNameSuffixLength);

        options.name = programName;
        options.csdGroup = csdGroup;
        options.regionName = regionName;

        try {
            await defineProgram(session, options);
            await installProgram(session, options);
            response = await discardProgram(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await deleteProgram(session, options);
    });

    it("should fail to discard a program from CICS with invalid CICS region", async () => {
        let error;
        let response;

        const programNameSuffixLength = 4;
        const programName = "AAAA" + generateRandomAlphaNumericString(programNameSuffixLength);

        options.name = programName;
        options.csdGroup = csdGroup;
        options.regionName = "FAKE";

        try {
            response = await discardProgram(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });
});
