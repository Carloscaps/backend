import nodemailer from 'nodemailer';

export const sendMail = (to) => {
    return new Promise((resolve, reject) => {
        const emailSend = 'juanpmartinezromero@gmail.com';
        const passEmail = 'lolowerty21';

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailSend,
                pass: passEmail
            }
        });

        transporter.sendMail({
            from: emailSend,
            to: to,
            subject: "Solicitud Wilug",
            text: "Estimando cliente su solicitud fue recibia con exito, nos comunicaremos con usted para más información, atte Wilug",
        })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err)
            })
    })
};