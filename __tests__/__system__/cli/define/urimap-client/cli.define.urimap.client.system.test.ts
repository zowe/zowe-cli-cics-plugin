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

import { ITestEnvironment, TestEnvironment, runCliScript } from "@zowe/ts-cli-test-utils";
import { ITestPropertiesSchema } from "../../../../__src__/doc/ITestPropertiesSchema";
import { Session } from "@zowe/imperative";

let TEST_ENVIRONMENT: ITestEnvironment<ITestPropertiesSchema>;
let regionName: string;
let csdGroup: string;
let host: string;
let port: number;
let user: string;
let password: string;
let protocol: string;
let rejectUnauthorized: boolean;
let session: Session;
let certificate: string;

describe("CICS define urimap-client command", () => {

    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "define_urimap_client",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        const cicsProperties = TEST_ENVIRONMENT.systemTestProperties.cics;
        csdGroup = TEST_ENVIRONMENT.systemTestProperties.cmci.csdGroup;
        regionName = TEST_ENVIRONMENT.systemTestProperties.cmci.regionName;
        host = TEST_ENVIRONMENT.systemTestProperties.cics.host;
        port = TEST_ENVIRONMENT.systemTestProperties.cics.port;
        user = TEST_ENVIRONMENT.systemTestProperties.cics.user;
        password = TEST_ENVIRONMENT.systemTestProperties.cics.password;
        protocol = TEST_ENVIRONMENT.systemTestProperties.cics.protocol;
        rejectUnauthorized = TEST_ENVIRONMENT.systemTestProperties.cics.rejectUnauthorized;
        certificate = TEST_ENVIRONMENT.systemTestProperties.urimap.certificate;
        session = new Session({
            type: "basic",
            hostname: cicsProperties.host,
            port: cicsProperties.port,
            user: cicsProperties.user,
            password: cicsProperties.password,
            rejectUnauthorized: cicsProperties.rejectUnauthorized || false,
            protocol: cicsProperties.protocol as any || "https",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });

    it("should be able to display the help", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_client_help.sh", TEST_ENVIRONMENT, []);
        expect(output.stderr.toString()).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toMatchSnapshot();
    });

    it("should get a syntax error if urimap name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_client.sh", TEST_ENVIRONMENT,
            ["", "FAKEGRP", "FAKEPATH", "FAKEHOST", "FAKERGN", "false", "BASIC", certificate]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("urimap");
        expect(stderr).toContain("name");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if CSD group is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_client.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "", "FAKEPATH", "FAKEHOST", "FAKERGN", "false", "BASIC", certificate]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("csdGroup");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if urimap path is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_client.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "", "FAKEHOST", "FAKERGN", "false", "BASIC", certificate]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("urimap-path");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if urimap host is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_client.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "FAKEPATH", "", "FAKERGN", "false", "BASIC", certificate]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("urimap-host");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if region name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_urimap_client.sh", TEST_ENVIRONMENT,
            ["FAKESRV", "FAKEGRP", "FAKEPATH", "FAKEHOST", "", "false", "BASIC", certificate]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("region-name");
        expect(output.status).toEqual(1);
    });
});
