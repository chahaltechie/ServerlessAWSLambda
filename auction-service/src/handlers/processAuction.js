import {getEndedAuctions} from "../lib/getEndedAuctions";
import AWS from 'aws-sdk';
import createError from 'http-errors';
import {closeAuction} from "../lib/closeAuction";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function processAuction(event, context) {
    try {
        const auctions = await getEndedAuctions();
        //update the status to closed
        if (auctions && auctions.length > 0) {
            const closedPromise = auctions.map(auction => {
                closeAuction(auction);
            });
            await Promise.all(closedPromise);
            return {closed: closedPromise.length};
        }
    } catch (e) {
        throw new createError.InternalServerError(e);
    }
}

export const handler = processAuction;