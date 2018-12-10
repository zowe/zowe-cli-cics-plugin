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
import { runCliScript } from "../../../../__src__/TestUtils";
import { Session } from "@brightside/imperative";
import { defineProgram, deleteProgram, discardProgram, installProgram, IProgramParms } from "../../../../../src";

let TEST_ENVIRONMENT: ITestEnvironment;
let regionName: string;
let csdGroup: string;
let session: Session;

describe("CICS refresh program command", () => {

    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "refresh_program",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = TEST_ENVIRONMENT.systemTestProperties.cmci.csdGroup;
        regionName = TEST_ENVIRONMENT.systemTestProperties.cmci.regionName;
        const cmciProperties = await TEST_ENVIRONMENT.systemTestProperties.cmci;

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
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });


    it("should be able to display the help", () => {
        const output = runCliScript(__dirname + "/__scripts__/refresh_program_help.sh", TEST_ENVIRONMENT, []);
        expect(output.stderr.toString()).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to successfully refresh a program with basic options", async () => {
        // Expecting to be able to refresh a program called TESTPRG# (where # is a number from 1 to MAX_PROGRAMS)
        const MAX_PROGRAMS = 4;
        const programName = "TESTPRG" + (Math.floor(Math.random() * MAX_PROGRAMS) + 1).toString();

        const options: IProgramParms = {
            name: programName,
            csdGroup,
            regionName
        };

        await defineProgram(session, options);
        await installProgram(session, options);

        const output = runCliScript(__dirname + "/__scripts__/refresh_program.sh", TEST_ENVIRONMENT, [programName, regionName]);
        const stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");

        await discardProgram(session, options);
        await deleteProgram(session, options);
    });

    it("should get a syntax error if program name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/refresh_program.sh", TEST_ENVIRONMENT, ["", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("Missing Positional Argument");
        expect(stderr).toContain("programName");
        expect(output.status).toEqual(1);
    });
});
