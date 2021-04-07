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
import { defineTransaction, deleteTransaction, discardTransaction, installTransaction, ITransactionParms } from "../../../../../src";

let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let programName: string;
let regionName: string;
let csdGroup: string;
let session: Session;

describe("CICS Install transaction", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_install_transaction",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        programName = "program1";
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

    const options: ITransactionParms = {} as any;

    it("should install a transaction to CICS", async () => {
        let error;
        let response;

        const transactionNameSuffixLength = 3;
        const transactionName = "X" + generateRandomAlphaNumericString(transactionNameSuffixLength);

        options.name = transactionName;
        options.programName = programName;
        options.csdGroup = csdGroup;
        options.regionName = regionName;

        try {
            await defineTransaction(session, options);
            response = await installTransaction(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await discardTransaction(session, options);
        await deleteTransaction(session, options);
    });

    it("should fail to install a transaction to CICS with invalid CICS region", async () => {
        let error;
        let response;

        const transactionNameSuffixLength = 3;
        const transactionName = "X" + generateRandomAlphaNumericString(transactionNameSuffixLength);

        options.name = transactionName;
        options.csdGroup = csdGroup;
        options.regionName = "FAKE";

        try {
            response = await installTransaction(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });
});
