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
import { ITestEnvironment, TestEnvironment } from "@zowe/cli-test-utils";
import { ITestPropertiesSchema } from "../../../../__src__/doc/ITestPropertiesSchema";
import { generateRandomAlphaNumericString } from "../../../../__src__/TestUtils";
import { defineUrimapPipeline, deleteUrimap, IURIMapParms } from "../../../../../src";

let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let regionName: string;
let csdGroup: string;
let session: Session;
let enable: boolean;
let urimapName: string;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const sleepTime = 4000;

describe("CICS Define pipeline URImap", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_define_urimap-pipeline",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = testEnvironment.systemTestProperties.cmci.csdGroup;
        regionName = testEnvironment.systemTestProperties.cmci.regionName;
        enable = false;
        const cicsProperties = testEnvironment.systemTestProperties.cics;
        const urimapNameSuffixLength = 4;
        urimapName = "AAAA" + generateRandomAlphaNumericString(urimapNameSuffixLength);

        session = new Session({
            user: cicsProperties.user,
            password: cicsProperties.password,
            hostname: cicsProperties.host,
            port: cicsProperties.port,
            type: "basic",
            rejectUnauthorized: cicsProperties.rejectUnauthorized || false,
            protocol: cicsProperties.protocol as any || "https",
        });
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(testEnvironment);
    });

    const options: IURIMapParms = {} as any;

    it("should define a URIMap to CICS", async () => {
        let error;
        let response;

        options.name = urimapName;
        options.path = "fake";
        options.host = "fake";
        options.scheme = "https";
        options.pipelineName = "AAAA1234";
        options.csdGroup = csdGroup;
        options.enable = enable;
        options.regionName = regionName;
        options.tcpipservice = "TESTSVC";

        try {
            response = await defineUrimapPipeline(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await sleep(sleepTime);
        await deleteUrimap(session, options);
    });

    it("should fail to define a URIMap to CICS with invalid CICS region", async () => {
        let error;
        let response;

        options.name = urimapName;
        options.path = "fake";
        options.host = "fake";
        options.scheme = "https";
        options.pipelineName = "AAAA1234";
        options.csdGroup = csdGroup;
        options.regionName = "FAKE";
        options.tcpipservice = "TESTSVC";

        try {
            response = await defineUrimapPipeline(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });

    it("should fail to define a URIMap to CICS due to duplicate name", async () => {
        let error;
        let response;

        options.name = urimapName;
        options.path = "fake";
        options.host = "fake";
        options.scheme = "https";
        options.pipelineName = "AAAA1234";
        options.csdGroup = csdGroup;
        options.enable = enable;
        options.regionName = regionName;
        options.tcpipservice = "TESTSVC";

        // define a URIMap to CICS
        try {
            response = await defineUrimapPipeline(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        response = null; // reset
        await sleep(sleepTime);

        // define the same URIMap and validate duplicate error
        try {
            response = await defineUrimapPipeline(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("DUPRES");
        await sleep(sleepTime);
        await deleteUrimap(session, options);
    });
});
