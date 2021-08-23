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

import { ITestEnvironment, TestEnvironment, runCliScript } from "@zowe/cli-test-utils";
import { ITestPropertiesSchema } from "../../../../__src__/doc/ITestPropertiesSchema";

let TEST_ENVIRONMENT: ITestEnvironment<ITestPropertiesSchema>;
let regionName: string;
let csdGroup: string;
let host: string;
let port: number;
let user: string;
let password: string;
let protocol: string;
let rejectUnauthorized: boolean;
describe("CICS remove-from-list csdGroup command", () => {

    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "remove_from_list_csdGroup",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = TEST_ENVIRONMENT.systemTestProperties.cmci.csdGroup;
        regionName = TEST_ENVIRONMENT.systemTestProperties.cmci.regionName;
        host = TEST_ENVIRONMENT.systemTestProperties.cics.host;
        port = TEST_ENVIRONMENT.systemTestProperties.cics.port;
        user = TEST_ENVIRONMENT.systemTestProperties.cics.user;
        password = TEST_ENVIRONMENT.systemTestProperties.cics.password;
        protocol = TEST_ENVIRONMENT.systemTestProperties.cics.protocol;
        rejectUnauthorized = TEST_ENVIRONMENT.systemTestProperties.cics.rejectUnauthorized;
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });

    it("should be able to display the help", () => {
        const output = runCliScript(__dirname + "/__scripts__/remove_from_list_csdGroup_help.sh", TEST_ENVIRONMENT, []);
        expect(output.stderr.toString()).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toMatchSnapshot();
    });

    it("should get a syntax error if csdGroup name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/remove_from_list_csdGroup.sh", TEST_ENVIRONMENT,
            ["", "FAKELIST", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("Missing Positional Argument");
        expect(stderr).toContain("name of the CSD Group");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if list name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/remove_from_list_csdGroup.sh", TEST_ENVIRONMENT,
            ["FAKEGRP", "", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("Missing Positional Argument");
        expect(stderr).toContain("name of the CSD List");
        expect(output.status).toEqual(1);
    });

    it("should be able to successfully add and remove a csdGroup to/from a list with basic options", async () => {
        const dummyList = "TESTLIST";
        let output = runCliScript(__dirname + "/../../add-to-list/csdGroup/__scripts__/add_to_list_csdGroup.sh", TEST_ENVIRONMENT,
            [csdGroup, dummyList,  regionName]);
        let stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");

        output = runCliScript(__dirname + "/__scripts__/remove_from_list_csdGroup.sh", TEST_ENVIRONMENT,
            [csdGroup, dummyList,  regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
    });

    it("should be able to successfully add and remove a csdGroup to/from a list with profile options", async () => {
        const dummyList = "TESTLIST";
        let output = runCliScript(__dirname + "/../../add-to-list/csdGroup/__scripts__/add_to_list_csdGroup_fully_qualified.sh", TEST_ENVIRONMENT,
            [csdGroup,
                dummyList,
                regionName,
                host,
                port,
                user,
                password,
                protocol,
                rejectUnauthorized]);
        let stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");

        output = runCliScript(__dirname + "/__scripts__/remove_from_list_csdGroup_fully_qualified.sh", TEST_ENVIRONMENT,
            [csdGroup,
                dummyList,
                regionName,
                host,
                port,
                user,
                password,
                protocol,
                rejectUnauthorized]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
    });
});
