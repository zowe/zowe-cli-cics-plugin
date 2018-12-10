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

let TEST_ENVIRONMENT: ITestEnvironment;
let regionName: string;
let csdGroup: string;

describe("CICS delete program command", () => {

    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "delete_program",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = TEST_ENVIRONMENT.systemTestProperties.cmci.csdGroup;
        regionName = TEST_ENVIRONMENT.systemTestProperties.cmci.regionName;
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });

    it("should be able to display the help", () => {
        const output = runCliScript(__dirname + "/__scripts__/delete_program_help.sh", TEST_ENVIRONMENT, []);
        expect(output.stderr.toString()).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to successfully delete a program with basic options", async () => {

        // Get a random program name
        const programNameSuffixLength = 4;
        const programName = "AAAA" + generateRandomAlphaNumericString(programNameSuffixLength);

        // Define the program
        let output = runCliScript(__dirname + "/../../define/program/__scripts__/define_program.sh", TEST_ENVIRONMENT,
            [programName, csdGroup, regionName]);
        let stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");

        output = runCliScript(__dirname + "/__scripts__/delete_program.sh", TEST_ENVIRONMENT,
            [programName, csdGroup, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
    });

    it("should get a syntax error if program name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/delete_program.sh", TEST_ENVIRONMENT, ["", "FAKEGROUP", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("Missing Positional Argument");
        expect(stderr).toContain("programName");
        expect(output.status).toEqual(1);
    });
});
