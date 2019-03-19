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
import {
    CicsCmciConstants,
    CicsCmciRestClient,
    getResource,
    IResourceParms
} from "../../../../src";

describe("CMCI - Get resource", () => {

    const resource = "resource";
    const region = "region";
    const cicsPlex = "plex";
    const criteria = "program=D*";
    const content = "This\nis\r\na\ntest";

    const resourceParms: IResourceParms = {
        regionName: region,
        name: resource,
        criteria,
        cicsPlex: undefined
    };

    const dummySession = new Session({
        user: "fake",
        password: "fake",
        hostname: "fake",
        port: 1490
    });

    let error: any;
    let response: any;
    let endPoint: string;

    describe("validation", () => {
        beforeEach(() => {
            response = undefined;
            error = undefined;
        });

        it("should throw error if no parms are defined", async () => {
            try {
                response = await getResource(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Cannot read property 'name' of undefined");
        });

        it("should throw error if resource name is not defined", async () => {
            try {
                response = await getResource(dummySession, {
                    regionName: "fake",
                    name: undefined,
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS resource name is required");
        });

        it("should throw error if CICS Region name is not defined", async () => {
            try {
                response = await getResource(dummySession, {
                    regionName: undefined,
                    name: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw error if resource name is missing", async () => {
            try {
                response = await getResource(dummySession, {
                    regionName: "fake",
                    name: ""
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Resource name' must not be blank");
        });

        it("should throw error if CICS Region name is missing", async () => {
            try {
                response = await getResource(dummySession, {
                    regionName: "",
                    name: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Region name' must not be blank");
        });
     });

    describe("success scenarios", () => {

        const deleteSpy = jest.spyOn(CicsCmciRestClient, "getExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            deleteSpy.mockClear();
            deleteSpy.mockImplementation(() => content);
        });

        it("should be able to get a resource without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" + resource +
                "/" + region + "?CRITERIA=(" + encodeURIComponent(resourceParms.criteria) + ")";

            response = await getResource(dummySession, resourceParms);

            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to get a resource without criteria specified", async () => {
            resourceParms.criteria = undefined;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" + resource +
                "/" + region;

            response = await getResource(dummySession, resourceParms);

            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to get a resource with cicsPlex specified and criteria not specified", async () => {
            resourceParms.cicsPlex = cicsPlex;
            resourceParms.criteria = undefined;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +  resource +
                "/" + cicsPlex + "/" + region;

            response = await getResource(dummySession, resourceParms);

            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });

        it("should be able to get a resource with criteria specified", async () => {
            resourceParms.cicsPlex = undefined;
            resourceParms.criteria = criteria;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +  resource +
                "/" + region + "?CRITERIA=(" + encodeURIComponent(resourceParms.criteria) + ")";
            response = await getResource(dummySession, resourceParms);

            expect(response).toContain(content);
            expect(deleteSpy).toHaveBeenCalledWith(dummySession, endPoint, []);
        });
    });
});
