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
import { defineTransaction, deleteTransaction, discardTransaction, installTransaction, ITransactionParms } from "../../../../../src";

let testEnvironment: ITestEnvironment;
let regionName: string;
let csdGroup: string;
let session: Session;

describe("CICS Discard transaction", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_discard_transaction",
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
            protocol:  testEnvironment.systemTestProperties.cmci.protocol as any || "http",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(testEnvironment);
    });

    const options: ITransactionParms = {} as any;

    it("should discard a transaction from CICS", async () => {
        let error;
        let response;

        const programName = "program1";
        const transactionNameSuffixLength = 3;
        const transactionName = "X" + generateRandomAlphaNumericString(transactionNameSuffixLength);

        options.name = transactionName;
        options.programName = programName;
        options.csdGroup = csdGroup;
        options.regionName = regionName;

        try {
            await defineTransaction(session, options);
            await installTransaction(session, options);
            response = await discardTransaction(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await deleteTransaction(session, options);
    });

    it("should fail to discard a transaction from CICS with invalid CICS region", async () => {
        let error;
        let response;

        const transactionNameSuffixLength = 3;
        const transactionName = "X" + generateRandomAlphaNumericString(transactionNameSuffixLength);

        options.name = transactionName;
        options.csdGroup = csdGroup;
        options.regionName = "FAKE";

        try {
            response = await discardTransaction(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });
});
