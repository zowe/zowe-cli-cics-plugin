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
import { CicsCmciConstants, CicsCmciRestClient, installProgram, IProgramParms } from "../../../../src";

describe("CMCI - Install program", () => {

    const program = "program";
    const region = "region";
    const group = "group";
    const cicsPlex = "plex";
    const content = "This\nis\r\na\ntest";

    const installParms: IProgramParms = {
        regionName: region,
        name: program,
        csdGroup: group,
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
                response = await installProgram(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toMatch(/Cannot read (property 'name' of undefined|properties of undefined \(reading 'name'\))/);
        });

        it("should throw error if program name is not defined", async () => {
            try {
                response = await installProgram(dummySession, {
                    regionName: "fake",
                    name: undefined,
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS program name is required");
        });

        it("should throw error if CSD group is not defined", async () => {
            try {
                response = await installProgram(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    csdGroup: undefined
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS CSD group is required");
        });

        it("should throw error if CICS Region name is not defined", async () => {
            try {
                response = await installProgram(dummySession, {
                    regionName: undefined,
                    name: "fake",
                    csdGroup: "fake"
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
                response = await installProgram(dummySession, {
                    regionName: "fake",
                    name: "",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Program name' must not be blank");
        });

        it("should throw error if CSD group is missing", async () => {
            try {
                response = await installProgram(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    csdGroup: ""
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS CSD Group' must not be blank");
        });

        it("should throw error if CICS Region name is missing", async () => {
            try {
                response = await installProgram(dummySession, {
                    regionName: "",
                    name: "fake",
                    csdGroup: "fake"
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
                        name: "CSDINSTALL",
                    }
                }
            }
        };

        const installSpy = jest.spyOn(CicsCmciRestClient, "putExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            installSpy.mockClear();
            installSpy.mockImplementation(() => content);
        });

        it("should be able to install a program without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_PROGRAM + "/" + region +
                "?CRITERIA=(NAME=" + installParms.name + ")&PARAMETER=CSDGROUP(" + installParms.csdGroup + ")";

            response = await installProgram(dummySession, installParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(installSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to install a program with cicsPlex specified but empty string", async () => {
            installParms.cicsPlex = "";
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_PROGRAM + "//" + region +
                "?CRITERIA=(NAME=" + installParms.name + ")&PARAMETER=CSDGROUP(" + installParms.csdGroup + ")";

            response = await installProgram(dummySession, installParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(installSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to install a program with cicsPlex specified", async () => {
            installParms.cicsPlex = cicsPlex;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_PROGRAM + "/" + cicsPlex + "/" + region +
                "?CRITERIA=(NAME=" + installParms.name + ")&PARAMETER=CSDGROUP(" + installParms.csdGroup + ")";

            response = await installProgram(dummySession, installParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(installSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });
    });
});
