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

import { IImperativeError, RestClient, Session } from "@zowe/imperative";
import { CicsCmciRestClient } from "../../../src";

describe("CicsCmciRestClient tests", () => {
    const dummySession = new Session({hostname: "dummy"});
    const testEndpoint = "testing";
    const dummyHeaders = [{testEndpoint}];

    const restClientExpect = jest.spyOn(RestClient, "getExpectString");

    beforeEach(() => {
        restClientExpect.mockClear();
    });

    it("should return a formatted JSON object based on the XML retrieved", async () => {
        const breakfastMenu =
            "<response>" +
                "<resultsummary api_response1='1024' api_response2='0' />" +
                "<breakfast_menu>\n" +
                "<food>\n" +
                    "<name>French Toast</name>\n" +
                    "<price currency='USD'>$5.95</price>\n" +
                "</food>\n" +
                "<food>\n" +
                    "<name>Homestyle Breakfast</name>\n" +
                    "<price currency='USD' size='small'>$6.95</price>\n" +
                    "<price currency='USD' size='medium'>$7.95</price>\n" +
                    "<price currency='USD' size='large'>$8.95</price>\n" +
                "</food>\n" +
                "</breakfast_menu>" +
            "</response>";
        const breakfastMenuJson = {
            response: {
                resultsummary: {
                    api_response1: "1024",
                    api_response2: "0"
                },
                breakfast_menu: {
                    food: [
                        {
                            name: "French Toast",
                            price: {
                                currency: "USD",
                                _: "$5.95"
                            }
                        },
                        {
                            name: "Homestyle Breakfast",
                            price: [
                                {
                                    currency: "USD",
                                    size: "small",
                                    _: "$6.95"
                                },
                                {
                                    currency: "USD",
                                    size: "medium",
                                    _: "$7.95"
                                },
                                {
                                    currency: "USD",
                                    size: "large",
                                    _: "$8.95"
                                }
                            ]
                        }
                    ]
                }
            }
        };
        restClientExpect.mockImplementation(() => breakfastMenu);

        const response = await CicsCmciRestClient.getExpectParsedXml(dummySession, testEndpoint, dummyHeaders);
        expect(restClientExpect).toHaveBeenCalledWith(dummySession, testEndpoint, dummyHeaders);
        expect(response).toEqual(breakfastMenuJson);
    });

    it("should delete stack from any CICS CMCI errors before presenting them to users", () => {
        const cicsCmciRestClient = new CicsCmciRestClient(dummySession);
        const shouldNotDeleteMessage = "This should not be deleted";
        const shouldDeleteMessage = "This should be deleted";
        const error: IImperativeError = {
            msg: "hello",
            causeErrors: JSON.stringify({
                stack: shouldDeleteMessage,
                shouldNotDelete: shouldNotDeleteMessage
            })
        };
        const processedError = ((cicsCmciRestClient as any).processError(error));
        expect(processedError.msg).toContain(shouldNotDeleteMessage);
        expect(processedError.msg.indexOf()).toEqual(-1);

    });
});
