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
import { CicsCmciConstants, CicsCmciRestClient, defineProgram, IProgramParms } from "../../../../src";

describe("CMCI - Define program", () => {

    const program = "program";
    const region = "region";
    const group = "group";
    const cicsPlex = "plex";
    const content = "This\nis\r\na\ntest";

    const defineParms: IProgramParms = {
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
                response = await defineProgram(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toMatch(/(cannot read).*undefined/ig);
        });

        it("should throw error if program name is not defined", async () => {
            try {
                response = await defineProgram(dummySession, {
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
                response = await defineProgram(dummySession, {
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
                response = await defineProgram(dummySession, {
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
                response = await defineProgram(dummySession, {
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
                response = await defineProgram(dummySession, {
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
                response = await defineProgram(dummySession, {
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
                create: {
                    parameter: {
                        $: {
                            name: "CSD",
                        }
                    },
                    attributes: {
                        $: {
                            name: program,
                            csdgroup: group
                        }
                    }
                }
            }
        };

        const defineSpy = jest.spyOn(CicsCmciRestClient, "postExpectParsedXml").mockReturnValue(content);

        beforeEach(() => {
            response = undefined;
            error = undefined;
            defineSpy.mockClear();
            defineSpy.mockImplementation(() => content);
        });

        it("should be able to define a program without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_PROGRAM + "/" + region;

            response = await defineProgram(dummySession, defineParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to define a program with cicsPlex specified but empty string", async () => {
            defineParms.cicsPlex = "";
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_PROGRAM + "//" + region;

            response = await defineProgram(dummySession, defineParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to define a program with cicsPlex specified", async () => {
            defineParms.cicsPlex = cicsPlex;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_PROGRAM + "/" + cicsPlex + "/" + region;

            response = await defineProgram(dummySession, defineParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });
    });
});
