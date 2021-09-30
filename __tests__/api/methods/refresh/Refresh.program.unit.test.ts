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
import { CicsCmciConstants, CicsCmciRestClient, programNewcopy, IProgramParms } from "../../../../src";

describe("CMCI - Refresh program", () => {

    const program = "program";
    const region = "region";
    const cicsPlex = "plex";
    const content = "This\nis\r\na\ntest";

    const refreshParms: IProgramParms = {
        regionName: region,
        name: program,
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
                response = await programNewcopy(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toMatch(/Cannot read (property 'name' of undefined|properties of undefined \(reading 'name'\))/);
        });

        it("should throw error if program name is not defined", async () => {
            try {
                response = await programNewcopy(dummySession, {
                    regionName: "fake",
                    name: undefined,
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS program name is required");
        });

        it("should throw error if CICS Region name is not defined", async () => {
            try {
                response = await programNewcopy(dummySession, {
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

        it("should throw error if program name is missing", async () => {
            try {
                response = await programNewcopy(dummySession, {
                    regionName: "fake",
                    name: ""
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Program name' must not be blank");
        });

        it("should throw error if CICS Region name is missing", async () => {
            try {
                response = await programNewcopy(dummySession, {
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

        const requestBody: any = {
            request: {
                action: {
                    $: {
                        name: "NEWCOPY",
                    }
                }
            }
        };

        const refreshSpy = jest.spyOn(CicsCmciRestClient, "putExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            refreshSpy.mockClear();
            refreshSpy.mockImplementation(() => content);
        });

        it("should be able to refresh a program without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_PROGRAM_RESOURCE + "/" + region +
                "?CRITERIA=(PROGRAM=" + refreshParms.name + ")";

            response = await programNewcopy(dummySession, refreshParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(refreshSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to refresh a program with cicsPlex specified but empty string", async () => {
            refreshParms.cicsPlex = "";
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_PROGRAM_RESOURCE + "//" + region +
                "?CRITERIA=(PROGRAM=" + refreshParms.name + ")";

            response = await programNewcopy(dummySession, refreshParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(refreshSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to refresh a program with cicsPlex specified", async () => {
            refreshParms.cicsPlex = cicsPlex;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_PROGRAM_RESOURCE + "/" + cicsPlex + "/" + region +
                "?CRITERIA=(PROGRAM=" + refreshParms.name + ")";

            response = await programNewcopy(dummySession, refreshParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(refreshSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });
    });
});
