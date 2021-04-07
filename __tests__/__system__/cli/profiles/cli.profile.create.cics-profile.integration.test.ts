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
import { ITestPropertiesSchema } from "../../../__src__/doc/ITestPropertiesSchema";

let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

/*
 NOTE!!  The cics plugin must be installed into Brightside in order to test the creation of a cics profile.
  */

describe("Create cics Profile", () => {

    const args: any[] = [];

    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "zos_create_cics_profile",
            installPlugin: true
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(testEnvironment);
    });

    describe("Success scenarios", () => {

        it("should display create cics profile help", () => {

            const scriptPath = __dirname + "/__scripts__/create_cics_profile_help.sh";
            const response = runCliScript(scriptPath, testEnvironment, args);

            expect(response.stderr.toString()).toBe("");
            expect(response.status).toBe(0);
            expect(response.stdout.toString()).toMatchSnapshot();
        });

        it("should create cics profile", () => {

            const scriptPath = __dirname + "/__scripts__/create_cics_profile.sh";
            const response = runCliScript(scriptPath,
                testEnvironment, args);

            expect(response.stderr.toString()).toBe("");
            expect(response.status).toBe(0);
            expect(response.stdout.toString()).toContain("Profile created successfully");
        });
    });
});
