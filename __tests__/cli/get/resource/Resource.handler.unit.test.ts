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

import { IHandlerParameters, IProfile, CommandProfiles, Session } from "@brightside/imperative";
import { ICMCIApiResponse } from "../../../../src";
import { ResourceDefinition } from "../../../../src/cli/get/resource/Resource.definition";
import ResourceHandler from "../../../../src/cli/get/resource/Resource.handler";

jest.mock("../../../../src/api/methods/get");
const Get = require("../../../../src/api/methods/get");

const PROFILE_MAP = new Map<string, IProfile[]>();
PROFILE_MAP.set(
    "cics", [{
        name: "cics",
        type: "cics",
        host: "somewhere.com",
        port: "43443",
        user: "someone",
        password: "somesecret"
    }]
);
const PROFILES: CommandProfiles = new CommandProfiles(PROFILE_MAP);
const DEFAULT_PARAMETERS: IHandlerParameters = {
    arguments: {$0: "", _: []}, // Please provide arguments later on
    response: {
        data: {
            setMessage: jest.fn((setMsgArgs) => {
                expect(setMsgArgs).toMatchSnapshot();
            }),
            setObj: jest.fn((setObjArgs) => {
                expect(setObjArgs).toMatchSnapshot();
            })
        },
        console: {
            log: jest.fn((logs) => {
                expect(logs.toString()).toMatchSnapshot();
            }),
            error: jest.fn((errors) => {
                expect(errors.toString()).toMatchSnapshot();
            }),
            errorHeader: jest.fn(() => undefined)
        },
        progress: {
            startBar: jest.fn((parms) => undefined),
            endBar: jest.fn(() => undefined)
        },
        format: {
            output: jest.fn((parms) => {
                expect(parms).toMatchSnapshot();
            })
        }
    },
    definition: ResourceDefinition,
    fullDefinition: ResourceDefinition,
    profiles: PROFILES
};

describe("GetResourceHandler", () => {
    const resourceName = "testResource";
    const regionName = "testRegion";

    const defaultReturn: ICMCIApiResponse = {
        response: {
            resultsummary: {api_response1: "1024", api_response2: "0", recordcount: "0", displayed_recordcount: "0"},
            records: {}
        }
    };

    const functionSpy = jest.spyOn(Get, "getResource");

    beforeEach(() => {
        functionSpy.mockClear();
        defaultReturn.response.records[resourceName.toLowerCase()] = [{prop:"test1"}, {prop:"test2"}];
        functionSpy.mockImplementation(async () => defaultReturn);
    });

    it("should call the getResource api", async () => {
        const handler = new ResourceHandler();

        const commandParameters = {...DEFAULT_PARAMETERS};
        commandParameters.arguments = {
            ...commandParameters.arguments,
            resourceName,
            regionName
        };

        await handler.process(commandParameters);

        expect(functionSpy).toHaveBeenCalledTimes(1);
        const testProfile = PROFILE_MAP.get("cics")[0];
        expect(functionSpy).toHaveBeenCalledWith(
            new Session({
                type: "basic",
                hostname: testProfile.host,
                port: testProfile.port,
                user: testProfile.user,
                password: testProfile.password,
                strictSSL: false,
                protocol: "http",
            }),
            {
                name: resourceName,
                regionName
            }
        );
    });
});
