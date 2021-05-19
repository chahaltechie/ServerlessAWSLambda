import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import validator from "@middy/validator";
import createAuctionSchema from "../lib/schemas/createAuctionSchema";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
    const {title} = event.body;

    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);
    const auction = {
        id: uuid(),
        title: title,
        status: 'OPEN',
        createdAt: now.toISOString(),
        endingAt: endDate.toISOString(),
        highestBid: {
            amount: 0
        }
    };
    try {
        const result = await dynamoDb.put({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Item: auction
        }).promise();
    } catch (e) {
        console.error(e);
        throw new createError.InternalServerError(e);
    }


    return {
        statusCode: 201,
        body: JSON.stringify({auction}),
    };
}

export const handler = commonMiddleware(createAuction)
    .use(validator({
        inputSchema: createAuctionSchema
    }));


