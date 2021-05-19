import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
    let auction;
    try {
        const result = await dynamoDb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: {id}
        }).promise();
        auction = result.Item;

    } catch (e) {
        console.error(e);
        throw new createError.InternalServerError(e);
    }
    return auction;
}

async function getAuction(event, context) {
    let auction;
    let {id} = event.pathParameters;
    auction = await getAuctionById(id);

    if (!auction) {
        throw new createError.NotFound('auction id not found');
    }

    return {
        statusCode: 200,
        body: JSON.stringify({auction}),
    };
}

export const handler = commonMiddleware(getAuction);


