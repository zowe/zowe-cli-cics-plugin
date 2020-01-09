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
let host: string;
let port: number;
let user: string;
let password: string;
let protocol: string;
let rejectUnauthorized: boolean;
let certificate: string;
const enable: string = "false";
const authenticate: string = "BASIC";
const tcpipservice: string = "TESTSVC";

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const sleepTime = 2000;

describe("CICS disable urimap command", () => {

    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "disable_urimap",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = TEST_ENVIRONMENT.systemTestProperties.cmci.csdGroup;
        regionName = TEST_ENVIRONMENT.systemTestProperties.cmci.regionName;
        host = TEST_ENVIRONMENT.systemTestProperties.cmci.host;
        port = TEST_ENVIRONMENT.systemTestProperties.cmci.port;
        user = TEST_ENVIRONMENT.systemTestProperties.cmci.user;
        password = TEST_ENVIRONMENT.systemTestProperties.cmci.password;
        protocol = TEST_ENVIRONMENT.systemTestProperties.cmci.protocol;
        rejectUnauthorized = TEST_ENVIRONMENT.systemTestProperties.cmci.rejectUnauthorized;
        certificate = TEST_ENVIRONMENT.systemTestProperties.urimap.certificate;
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });

    it("should be able to display the help", () => {
        const output = runCliScript(__dirname + "/__scripts__/disable_urimap_help.sh", TEST_ENVIRONMENT, []);
        expect(output.stderr.toString()).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to disable a urimap of type server with basic options", async () => {
        const urimapNameSuffixLength = 6;
        const urimapName = "X" + generateRandomAlphaNumericString(urimapNameSuffixLength);
        const urimapPath = "fake/path";
        const urimapHost = "www.example.com";
        const programName = "FAKEPGM";

        let output = runCliScript(__dirname + "/../../define/urimap-server/__scripts__/define_urimap_server.sh", TEST_ENVIRONMENT,
            [urimapName, csdGroup, urimapPath, urimapHost, programName, regionName, enable, tcpipservice]);
        let stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../install/urimap/__scripts__/install_urimap.sh", TEST_ENVIRONMENT,
        [urimapName, csdGroup, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../enable/urimap/__scripts__/enable_urimap.sh", TEST_ENVIRONMENT,
        [urimapName, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/__scripts__/disable_urimap.sh", TEST_ENVIRONMENT,
            [urimapName, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../discard/urimap/__scripts__/discard_urimap.sh", TEST_ENVIRONMENT,
        [urimapName, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../delete/urimap/__scripts__/delete_urimap.sh", TEST_ENVIRONMENT,
            [urimapName, csdGroup, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
    });

    it("should be able to disable a urimap of type pipeline with basic options", async () => {
        const urimapNameSuffixLength = 6;
        const urimapName = "X" + generateRandomAlphaNumericString(urimapNameSuffixLength);
        const urimapPath = "fake/path";
        const urimapHost = "www.example.com";
        const pipelineName = "FAKEPIPE";

        let output = runCliScript(__dirname + "/../../define/urimap-pipeline/__scripts__/define_urimap_pipeline.sh", TEST_ENVIRONMENT,
            [urimapName, csdGroup, urimapPath, urimapHost, pipelineName, regionName, enable, tcpipservice]);
        let stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../install/urimap/__scripts__/install_urimap.sh", TEST_ENVIRONMENT,
        [urimapName, csdGroup, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../enable/urimap/__scripts__/enable_urimap.sh", TEST_ENVIRONMENT,
        [urimapName, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/__scripts__/disable_urimap.sh", TEST_ENVIRONMENT,
            [urimapName, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../discard/urimap/__scripts__/discard_urimap.sh", TEST_ENVIRONMENT,
        [urimapName, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../delete/urimap/__scripts__/delete_urimap.sh", TEST_ENVIRONMENT,
            [urimapName, csdGroup, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
    });

    it("should be able to disable a urimap of type client with basic options", async () => {
        const urimapNameSuffixLength = 6;
        const urimapName = "X" + generateRandomAlphaNumericString(urimapNameSuffixLength);
        const urimapPath = "fake/path";
        const urimapHost = "www.example.com";

        let output = runCliScript(__dirname + "/../../define/urimap-client/__scripts__/define_urimap_client.sh", TEST_ENVIRONMENT,
            [urimapName, csdGroup, urimapPath, urimapHost, regionName, enable, authenticate, certificate]);
        let stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../install/urimap/__scripts__/install_urimap.sh", TEST_ENVIRONMENT,
        [urimapName, csdGroup, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../enable/urimap/__scripts__/enable_urimap.sh", TEST_ENVIRONMENT,
        [urimapName, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/__scripts__/disable_urimap.sh", TEST_ENVIRONMENT,
            [urimapName, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../discard/urimap/__scripts__/discard_urimap.sh", TEST_ENVIRONMENT,
        [urimapName, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../delete/urimap/__scripts__/delete_urimap.sh", TEST_ENVIRONMENT,
            [urimapName, csdGroup, regionName]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");
    });

    it("should get a syntax error if urimapName is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/disable_urimap.sh", TEST_ENVIRONMENT, ["", "FAKEGRP", "FAKEREG"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("Missing Positional Argument");
        expect(stderr).toContain("urimapName");
        expect(output.status).toEqual(1);
    });

    it("should be able to successfully disable a urimap of type server with profile options", async () => {

        const urimapNameSuffixLength = 6;
        const urimapName = "X" + generateRandomAlphaNumericString(urimapNameSuffixLength);
        const urimapPath = "fake/path";
        const urimapHost = "www.example.com";
        const programName = "FAKEPGM";
        const urimapScheme = "HTTPS";

        let output = runCliScript(__dirname + "/../../define/urimap-server/__scripts__/define_urimap_server_fully_qualified.sh", TEST_ENVIRONMENT,
            [urimapName,
                csdGroup,
                urimapPath,
                urimapHost,
                urimapScheme,
                programName,
                regionName,
                enable,
                tcpipservice,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../install/urimap/__scripts__/install_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
        [urimapName,
            csdGroup,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../enable/urimap/__scripts__/enable_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
        [urimapName,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/__scripts__/disable_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
            [urimapName,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../discard/urimap/__scripts__/discard_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
        [urimapName,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../delete/urimap/__scripts__/delete_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
            [urimapName,
                csdGroup,
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

    it("should be able to successfully disable a pipeline of type server with profile options", async () => {

        const urimapNameSuffixLength = 6;
        const urimapName = "X" + generateRandomAlphaNumericString(urimapNameSuffixLength);
        const urimapPath = "fake/path";
        const urimapHost = "www.example.com";
        const pipelineName = "FAKEPIPE";
        const urimapScheme = "HTTPS";

        let output = runCliScript(__dirname + "/../../define/urimap-pipeline/__scripts__/define_urimap_pipeline_fully_qualified.sh", TEST_ENVIRONMENT,
            [urimapName,
                csdGroup,
                urimapPath,
                urimapHost,
                urimapScheme,
                pipelineName,
                regionName,
                enable,
                tcpipservice,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../install/urimap/__scripts__/install_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
        [urimapName,
            csdGroup,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../enable/urimap/__scripts__/enable_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
        [urimapName,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/__scripts__/disable_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
            [urimapName,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../discard/urimap/__scripts__/discard_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
        [urimapName,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../delete/urimap/__scripts__/delete_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
            [urimapName,
                csdGroup,
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

    it("should be able to successfully disable a urimap of type client with profile options", async () => {

        const urimapNameSuffixLength = 6;
        const urimapName = "X" + generateRandomAlphaNumericString(urimapNameSuffixLength);
        const urimapPath = "fake/path";
        const urimapHost = "www.example.com";
        const urimapScheme = "HTTPS";

        let output = runCliScript(__dirname + "/../../define/urimap-client/__scripts__/define_urimap_client_fully_qualified.sh", TEST_ENVIRONMENT,
            [urimapName,
                csdGroup,
                urimapPath,
                urimapHost,
                urimapScheme,
                regionName,
                enable,
                authenticate,
                certificate,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../install/urimap/__scripts__/install_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
        [urimapName,
            csdGroup,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../enable/urimap/__scripts__/enable_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
        [urimapName,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/__scripts__/disable_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
        [urimapName,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../discard/urimap/__scripts__/discard_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
        [urimapName,
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
        await sleep(sleepTime);

        output = runCliScript(__dirname + "/../../delete/urimap/__scripts__/delete_urimap_fully_qualified.sh", TEST_ENVIRONMENT,
            [urimapName,
                csdGroup,
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
