const utils = require("../Utils");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const dynamo = require("../../DB");
const nodemailer = require("nodemailer");

const register = async (req, res) => {
    try {
        utils.checkArgs(req.body, [
            "email",
            "password",
            "firstName",
            "lastName",
        ]);
    } catch (err) {
        res.status(err.status).json({ msg: err.msg });
        return;
    }

    const params = {
        TableName: "Users",
        IndexName: "Email",
        KeyConditionExpression: "email = :n",
        ExpressionAttributeValues: {
            ":n": req.body.email,
        },
    };

    let tmpUser = await dynamo.client().query(params).promise();
    if (tmpUser.Count != 0) {
        res.status(400).json({ msg: "Email already exists" });
        return;
    }

    let user = {
        id: uuidv4(),
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        checkoutId: uuidv4(),
        confirmed: false,
        createdTime: Date.now(),
        connected : []
    };

    await dynamo
        .client()
        .put({
            TableName: "Users",
            Item: user,
        })
        .promise();
    res.status(201).json({ msg: "ok", jwt: utils.encodeToken(user) });

    let checkoutUrl =
        process.env.WEB_URL +
        "/confirm?userId=" +
        user.id +
        "&checkoutId=" +
        user.checkoutId;

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });
    var mailOptions = {
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: "Confirme la création de ton compte AREA",
        html: `
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                <td align="center">
                    <h1 style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; text-align: center;">Confirme ton Email</h1>
                </td>
                </tr>
                <tr>
                <td align="center" style="padding-top: 15px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
                    <tr>
                        <td align="center" bgcolor="#0000FF" style="width: 200px; height: 50px; border-radius: 8px;">
                        <a href="${checkoutUrl}" style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif; font-size: 17px; color: white; text-decoration: none; display: block; line-height: 50px;">Confirmer mon compte</a>
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
        `,
    };

    transporter.sendMail(mailOptions);
};

module.exports = register;
