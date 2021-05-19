import {v4 as uuid} from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';
import {getAuctionById} from "./getAuction";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    let updatedAuction;
    const {id} = event.pathParameters;
    const {amount} = event.body;
    //check if passed auction id is valid or not.
    const auction = await getAuctionById(id);
    if (auction.highestBid && auction.highestBid.amount >= amount) {
        throw new createError.BadRequest(`bid amount has to be greater than ${auction.highestBid.amount}`);
    }
    try {
        const result = await dynamoDb.update({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: {id},
            UpdateExpression: 'set  highestBid.amount=:amount',
            ExpressionAttributeValues: {
                ':amount': amount
            },
            ReturnValues: "ALL_NEW"
        }).promise();

        updatedAuction = result.Attributes;

    } catch (e) {
        console.error(e);
        throw new createError.InternalServerError(e);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({auctions: updatedAuction}),
    };
}

export const handler = commonMiddleware(placeBid);


