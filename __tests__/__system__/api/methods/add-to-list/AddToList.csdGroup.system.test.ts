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
import { ITestEnvironment, TestEnvironment } from "@zowe/ts-cli-test-utils";
import { ITestPropertiesSchema } from "../../../../__src__/doc/ITestPropertiesSchema";
import { generateRandomAlphaNumericString } from "../../../../__src__/TestUtils";
import { addCSDGroupToList, removeCSDGroupFromList, ICSDGroupParms } from "../../../../../src";

let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let regionName: string;
let csdGroup: string;
let csdList: string;
let session: Session;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const sleepTime = 4000;

describe("CICS AddToList csdGroup", () => {

    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "cics_cmci_add-to-list_csd-group",
            installPlugin: true,
            tempProfileTypes: ["cics"]
        });
        csdGroup = testEnvironment.systemTestProperties.cmci.csdGroup;
        regionName = testEnvironment.systemTestProperties.cmci.regionName;
        const listNameSuffixLength = 4;
        const cicsProperties = testEnvironment.systemTestProperties.cics;
        csdList = "AAAA" + generateRandomAlphaNumericString(listNameSuffixLength);

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

    const options: ICSDGroupParms = {} as any;

    it("should add a csdGroup to a list in CICS", async () => {
        let error;
        let response;

        options.name = csdGroup;
        options.csdList = csdList;
        options.regionName = regionName;

        try {
            response = await addCSDGroupToList(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        expect(response.response.resultsummary.api_response1).toBe("1024");
        await sleep(sleepTime);
        await removeCSDGroupFromList(session, options);
    });

    it("should fail to add a csdGroup to a list in CICS with invalid CICS region", async () => {
        let error;
        let response;

        options.name = csdGroup;
        options.csdList = csdList;
        options.regionName = "FAKE";

        try {
            response = await addCSDGroupToList(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("INVALIDPARM");
    });

    it("should fail to add a csdGroup to a list in CICS due to duplicate name", async () => {
        let error;
        let response;

        options.name = csdGroup;
        options.csdList = csdList;
        options.regionName = regionName;

        try {
            response = await addCSDGroupToList(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeFalsy();
        expect(response).toBeTruthy();
        response = null; // reset
        await sleep(sleepTime);

        try {
            response = await addCSDGroupToList(session, options);
        } catch (err) {
            error = err;
        }

        expect(error).toBeTruthy();
        expect(response).toBeFalsy();
        expect(error.message).toContain("Did not receive the expected response from CMCI REST API");
        expect(error.message).toContain("DUPRES");
        await sleep(sleepTime);
        await removeCSDGroupFromList(session, options);
    });
});
