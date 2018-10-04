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

import { runCliScript } from "../../../../__src__/TestUtils";
import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";

// Test environment will be populated in the "beforeAll"
let TEST_ENVIRONMENT: ITestEnvironment;
let regionName: string;

describe("cics get resource", () => {

    // Create the unique test environment
    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "get_resource_command",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        regionName = TEST_ENVIRONMENT.systemTestProperties.cmci.regionName;
    });

    it("should display the help", async () => {
        const response = await runCliScript(__dirname + "/__scripts__/get_resource_help.sh", TEST_ENVIRONMENT);
        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to successfully get resources", async () => {
        const output = runCliScript(__dirname + "/__scripts__/get_resource.sh", TEST_ENVIRONMENT,
            ["CICSProgram", regionName]);
        const stderr = output.stderr.toString();
        const stdout = output.stdout.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(stdout).toContain("_keydata:");
    });

});
