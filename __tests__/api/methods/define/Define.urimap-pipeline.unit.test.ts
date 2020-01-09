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
import { CicsCmciRestClient, CicsCmciConstants, IURIMapParms, defineUrimapPipeline } from "../../../../src";

describe("CMCI - Define pipeline URIMap", () => {

    const urimap = "urimap";
    const path = "path";
    const host = "host";
    const scheme = "http";
    const pipeline = "pipeline";
    const region = "region";
    const group = "group";
    const cicsPlex = "plex";
    const content = "This\nis\r\na\ntest";
    const description = "description";
    const transaction = "transaction";
    const webservice = "webservice";
    const tcpipservice = "TCPIPSRV";

    const defineParms: IURIMapParms  = {
        regionName: region,
        name: urimap,
        path,
        host,
        scheme,
        pipelineName: pipeline,
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
                response = await defineUrimapPipeline(dummySession, undefined);
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Cannot read property 'name' of undefined");
        });

        it("should throw error if URIMap name is not defined", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: undefined,
                    path: "fake",
                    host: "fake",
                    scheme: "http",
                    pipelineName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS URIMap name is required");
        });

        it("should throw error if CSD group is not defined", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    path: "fake",
                    host: "fake",
                    scheme: "http",
                    pipelineName: "fake",
                    csdGroup: undefined
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS CSD group is required");
        });

        it("should throw error if URIMap path is not defined", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    path: undefined,
                    host: "fake",
                    scheme: "http",
                    pipelineName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS URIMap path is required");
        });

        it("should throw error if URIMap host is not defined", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    path: "fake",
                    host: undefined,
                    scheme: "http",
                    pipelineName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS URIMap host is required");
        });

        it("should throw error if URIMap scheme is not defined", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    path: "fake",
                    host: "fake",
                    scheme: undefined,
                    pipelineName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS URIMap scheme is required");
        });

        it("should throw error if CICS Region name is not defined", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: undefined,
                    name: "fake",
                    path: "fake",
                    host: "fake",
                    scheme: "http",
                    pipelineName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS region name is required");
        });

        it("should throw error if pipeline name is not defined", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    path: "fake",
                    host: "fake",
                    scheme: "http",
                    pipelineName: undefined,
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("CICS URIMap pipeline name is required");
        });

        it("should throw error if URIMap name is missing", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "",
                    path: "fake",
                    host: "fake",
                    scheme: "http",
                    pipelineName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS URIMap Name' must not be blank");
        });

        it("should throw error if CSD group is missing", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    path: "fake",
                    host: "fake",
                    scheme: "http",
                    pipelineName: "fake",
                    csdGroup: ""
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS CSD Group' must not be blank");
        });

        it("should throw error if URIMap path is missing", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    path: "",
                    host: "fake",
                    scheme: "http",
                    pipelineName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS URIMap Path' must not be blank");
        });

        it("should throw error if URIMap host is missing", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    path: "fake",
                    host: "",
                    scheme: "http",
                    pipelineName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS URIMap Host' must not be blank");
        });

        it("should throw error if URIMap scheme is missing", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    path: "fake",
                    host: "fake",
                    scheme: "",
                    pipelineName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS URIMap Scheme' must not be blank");
        });

        it("should throw error if CICS Region name is missing", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "",
                    name: "fake",
                    path: "fake",
                    host: "fake",
                    scheme: "http",
                    pipelineName: "fake",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS Region name' must not be blank");
        });

        it("should throw error if pipeline name is missing", async () => {
            try {
                response = await defineUrimapPipeline(dummySession, {
                    regionName: "fake",
                    name: "fake",
                    path: "fake",
                    host: "fake",
                    scheme: "http",
                    pipelineName: "",
                    csdGroup: "fake"
                });
            } catch (err) {
                error = err;
            }

            expect(response).toBeUndefined();
            expect(error).toBeDefined();
            expect(error.message).toContain("Required parameter 'CICS URIMap Pipeline name' must not be blank");
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
                            name: urimap,
                            csdgroup: group,
                            path,
                            host,
                            scheme,
                            pipeline,
                            usage: "pipeline",
                            status: "ENABLED"
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

        it("should be able to define a URIMap without cicsPlex specified", async () => {
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_URIMAP + "/" + region;

            response = await defineUrimapPipeline(dummySession, defineParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to define a URIMap with cicsPlex specified but empty string", async () => {
            defineParms.cicsPlex = "";
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_URIMAP + "//" + region;

            response = await defineUrimapPipeline(dummySession, defineParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to define a URIMap with cicsPlex specified", async () => {
            defineParms.cicsPlex = cicsPlex;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_URIMAP + "/" + cicsPlex +"/" + region;

            response = await defineUrimapPipeline(dummySession, defineParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });

        it("should be able to define a URIMap with optional parameters specified", async () => {
            defineParms.description = description;
            defineParms.transactionName = transaction;
            defineParms.webserviceName = webservice;
            defineParms.tcpipservice = tcpipservice;
            endPoint = "/" + CicsCmciConstants.CICS_SYSTEM_MANAGEMENT + "/" +
                CicsCmciConstants.CICS_DEFINITION_URIMAP + "/" + cicsPlex +"/" + region;
            requestBody.request.create.attributes.$.description = description;
            requestBody.request.create.attributes.$.transaction = transaction;
            requestBody.request.create.attributes.$.webservice = webservice;
            requestBody.request.create.attributes.$.tcpipservice = tcpipservice;

            response = await defineUrimapPipeline(dummySession, defineParms);

            // expect(response.success).toBe(true);
            expect(response).toContain(content);
            expect(defineSpy).toHaveBeenCalledWith(dummySession, endPoint, [], requestBody);
        });
    });
});
