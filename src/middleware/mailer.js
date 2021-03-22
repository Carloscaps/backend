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

export const sendMailWilug = (to) => {
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
            to: emailSend,
            subject: "Solicitud nueva",
            text: `Acaba de llegar una nueva solicitud de parte del cliente: ${to}`,
        })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err)
            })
    })
};

export const sendMailRecoverPassword = (to, password) => {
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
            subject: "Recuperación de contraseña",
            text: `Estimando cliente su contraseña se ha restaurado con exito, su contraseña es la siguiente: ${password}, atte Wilug`,
        })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err)
            })
    })
};

export const sendMailContactenos = (to, msg) => {
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
            to: emailSend,
            subject: "Contactenos",
            text: `Se acaba de poner en contar el cliente: ${to}, msg: ${msg}`,
        })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err)
            })
    })
};