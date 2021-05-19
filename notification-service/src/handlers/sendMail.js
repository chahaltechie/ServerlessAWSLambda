import AWS from 'aws-sdk';

const ses = new AWS.SES({region: 'us-east-1'});

async function sendMail(event, context) {
    console.log(event);
    const record = event.Records[0];
    console.log(record);
    
    const recordBody = JSON.parse(record.body);
    const { subject, body, recipient } = recordBody;
    const params = {
        Source: 'chahaltechie@gmail.com',
        Destination: {
            ToAddresses: [recipient],
        },
        Message: {
            Body: {
                Text: {
                    Data: body,
                },
            },
            Subject: {
                Data: subject,
            },
        },
    };

    try {
        const result = await ses.sendEmail(params).promise();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
}

export const handler = sendMail;


