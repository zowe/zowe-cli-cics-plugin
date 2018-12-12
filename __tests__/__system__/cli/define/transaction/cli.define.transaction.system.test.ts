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

import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";
import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { generateRandomAlphaNumericString, runCliScript } from "../../../../__src__/TestUtils";
import { Session } from "@brightside/imperative";
import { CicsCmciRestClient, CicsCmciConstants } from "../../../../../src";

let TEST_ENVIRONMENT: ITestEnvironment;
let regionName: string;
let csdGroup: string;
let host: string;
let port: number;
let user: string;
let password: string;

describe("CICS define transaction command", () => {

    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "define_transaction",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = TEST_ENVIRONMENT.systemTestProperties.cmci.csdGroup;
        regionName = TEST_ENVIRONMENT.systemTestProperties.cmci.regionName;
        host = TEST_ENVIRONMENT.systemTestProperties.cmci.host;
        port = TEST_ENVIRONMENT.systemTestProperties.cmci.port;
        user = TEST_ENVIRONMENT.systemTestProperties.cmci.user;
        password = TEST_ENVIRONMENT.systemTestProperties.cmci.password;
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });

    const deleteTransaction = async (transactionName: string) => {
        const cmciProperties = TEST_ENVIRONMENT.systemTestProperties.cmci;
        const session = new Session({
            type: "basic",
            hostname: cmciProperties.host,
            port: cmciProperties.port,
            user: cmciProperties.user,
            password: cmciProperties.password,
            strictSSL: false,
            protocol: "http",
        });

        return CicsCmciRestClient.deleteExpectParsedXml(session,
            `/${CicsCmciConstants.CICS_SYSTEM_MANAGEMENT}/${CicsCmciConstants.CICS_DEFINITION_TRANSACTION}/${cmciProperties.regionName}` +
            `?CRITERIA=(NAME=${transactionName})&PARAMETER=CSDGROUP(${cmciProperties.csdGroup})`);
    };

    it("should be able to display the help", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_transaction_help.sh", TEST_ENVIRONMENT, []);
        expect(output.stderr.toString()).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to successfully define a transaction with basic options", async () => {
        const transactionNameSuffixLength = 3;
        const transactionName = "X" + generateRandomAlphaNumericString(transactionNameSuffixLength);
        const dummyPgmName = "TESTING";
        const output = runCliScript(__dirname + "/__scripts__/define_transaction.sh", TEST_ENVIRONMENT,
            [transactionName, dummyPgmName, csdGroup, regionName]);
        const stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await deleteTransaction(transactionName);
    });

    it("should get a syntax error if transaction name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_transaction.sh", TEST_ENVIRONMENT,
            ["", "FAKEPGM", "FAKEGRP", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("Missing Positional Argument");
        expect(stderr).toContain("transactionName");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if program name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_transaction.sh", TEST_ENVIRONMENT,
            ["FAKETRAN", "", "FAKEGRP", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("Missing Positional Argument");
        expect(stderr).toContain("programName");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if CSD group is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_transaction.sh", TEST_ENVIRONMENT,
            ["FAKETRAN", "FAKEPGM", "", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("Missing Positional Argument");
        expect(stderr).toContain("csdGroup");
        expect(output.status).toEqual(1);
    });

    it("should be able to successfully define a transaction with profile options", async () => {
        const transactionNameSuffixLength = 3;
        const transactionName = "X" + generateRandomAlphaNumericString(transactionNameSuffixLength);
        const dummyPgmName = "TESTING";
        const output = runCliScript(__dirname + "/__scripts__/define_transaction_fully_qualified.sh", TEST_ENVIRONMENT,
            [transactionName,
                dummyPgmName,
                csdGroup,
                regionName,
                host,
                port,
                user,
                password]);
        const stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await deleteTransaction(transactionName);
    });
});
