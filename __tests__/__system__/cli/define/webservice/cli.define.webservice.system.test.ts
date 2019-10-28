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
import { Session } from "@zowe/imperative";
import { IWebServiceParms } from "../../../../../src";
import { deleteWebservice } from "../../../../../src/api/methods/delete/Delete";

let TEST_ENVIRONMENT: ITestEnvironment;
let regionName: string;
let csdGroup: string;
let host: string;
let port: number;
let user: string;
let password: string;
let protocol: string;
let rejectUnauthorized: boolean;
let session: Session;

describe("CICS define web service command", () => {

    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "define_webservice",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        const cmciProperties = TEST_ENVIRONMENT.systemTestProperties.cmci;
        csdGroup = TEST_ENVIRONMENT.systemTestProperties.cmci.csdGroup;
        regionName = TEST_ENVIRONMENT.systemTestProperties.cmci.regionName;
        host = TEST_ENVIRONMENT.systemTestProperties.cmci.host;
        port = TEST_ENVIRONMENT.systemTestProperties.cmci.port;
        user = TEST_ENVIRONMENT.systemTestProperties.cmci.user;
        password = TEST_ENVIRONMENT.systemTestProperties.cmci.password;
        protocol = TEST_ENVIRONMENT.systemTestProperties.cmci.protocol;
        rejectUnauthorized = TEST_ENVIRONMENT.systemTestProperties.cmci.rejectUnauthorized;
        session = new Session({
            type: "basic",
            hostname: cmciProperties.host,
            port: cmciProperties.port,
            user: cmciProperties.user,
            password: cmciProperties.password,
            strictSSL: false,
            protocol: "http",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(TEST_ENVIRONMENT);
    });

    it("should be able to display the help", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_webservice_help.sh", TEST_ENVIRONMENT, []);
        expect(output.stderr.toString()).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to successfully define a web service with basic options", async () => {
        const websvcNameSuffixLength = 4;
        const websvcName = "DFN" + generateRandomAlphaNumericString(websvcNameSuffixLength);
        const options: IWebServiceParms = { name: websvcName, csdGroup, regionName };
        let output = runCliScript(__dirname + "/__scripts__/define_webservice.sh", TEST_ENVIRONMENT,
            [websvcName, csdGroup, "FAKEPIPE", "//u/exampleapp/wsbind/example.log", regionName]);
        let stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain("success");

        output = runCliScript(__dirname + "/__scripts__/get_resource_webservice.sh", TEST_ENVIRONMENT,
            [regionName, csdGroup]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain(websvcName);

        await deleteWebservice(session, options);
    });

    it("should get a syntax error if web service name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_webservice.sh", TEST_ENVIRONMENT,
            ["", "FAKEGRP", "FAKEPIPE", "FAKEWSB", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("webserviceName");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if CSD group is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_webservice.sh", TEST_ENVIRONMENT,
            ["FAKEWSVC", "", "FAKEPIPE", "FAKEWSB", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("csdGroup");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if web service pipeline name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_webservice.sh", TEST_ENVIRONMENT,
            ["FAKEWSVC", "FAKEGRP", "", "FAKEWSB", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("pipeline-name");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if web service binding file is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_webservice.sh", TEST_ENVIRONMENT,
            ["FAKEWSVC", "FAKEGRP", "FAKEPIPE", "", "FAKERGN"]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("wsbind");
        expect(output.status).toEqual(1);
    });

    it("should get a syntax error if region name is omitted", () => {
        const output = runCliScript(__dirname + "/__scripts__/define_webservice.sh", TEST_ENVIRONMENT,
            ["FAKEWSVC", "FAKEGRP", "FAKEPIPE", "FAKEWSB", ""]);
        const stderr = output.stderr.toString();
        expect(stderr).toContain("Syntax");
        expect(stderr).toContain("region-name");
        expect(output.status).toEqual(1);
    });

    it("should be able to successfully define a web service using profile options", async () => {
        const websvcNameSuffixLength = 4;
        const websvcName = "DFN" + generateRandomAlphaNumericString(websvcNameSuffixLength);
        const pipelineName = "FAKEPIPE";
        const wsBind = "//u/exampleapp/wsbind/example.log";
        const options: IWebServiceParms = { name: websvcName, csdGroup, regionName };
        let output = runCliScript(__dirname + "/__scripts__/define_webservice_fully_qualified.sh", TEST_ENVIRONMENT,
            [websvcName,
                csdGroup,
                pipelineName,
                wsBind,
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

        output = runCliScript(__dirname + "/__scripts__/get_resource_webservice_fully_qualified.sh", TEST_ENVIRONMENT,
            [regionName,
                csdGroup,
                host,
                port,
                user,
                password,
                protocol,
                rejectUnauthorized]);
        stderr = output.stderr.toString();
        expect(stderr).toEqual("");
        expect(output.status).toEqual(0);
        expect(output.stdout.toString()).toContain(websvcName);

        await deleteWebservice(session, options);
    });

});
