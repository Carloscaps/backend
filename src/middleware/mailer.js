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

export const sendMailFormulario = (to) => {
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
            subject: "Solicitud nueva mantencion ",
            text: `Ha sido solicitada una mantención del cliente 

            'Manuel Rodriguez
            nombre contacto: Manuel Rodriguez
            Rut:13.382.588-4
            Teléfono: 947294752
            Email: hola@asas
            Ciudad: Coquimbo
            Dirección: Los alelies 255
            
            MENSAJE

            Productos

            Extintor AC-K, 1 KG
            Extintor: CARRO PQS, 6 Kg
            Extintor: PQS ANSULI I-A-20-G, 100 KG' ${to}`,
        })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err)
            })
    })
}