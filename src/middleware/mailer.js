import nodemailer from 'nodemailer';

const emailByCity = (city) => {
    let email = "";
    let password = "";
    switch (city) {
        case "Coquimbo" || "La Serena":
            email = "juanpmartinezromero@gmail.com";
            password = "lolowerty21";
            break;
        case "Copiapo":
            email = "juanpmartinezromero@gmail.com";
            password = "lolowerty21";
            break;
        case "Santiago":
            email = "juanpmartinezromero@gmail.com";
            password = "lolowerty21";
            break;
        case "Calama":
            email = "juanpmartinezromero@gmail.com";
            password = "lolowerty21";
            break;
        default:
            email = "juanpmartinezromero@gmail.com";
            password = "lolowerty21";
            break;
    }

    return [email, password];
}

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
            subject: "Solicitud nuevo",
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

export const sendMailContactenos = (to, msg, comuna) => {
    return new Promise((resolve, reject) => {
        const [email, password] = emailByCity(comuna);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });

        transporter.sendMail({
            from: email,
            to: to,
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

export const sendMailFormulario = (user, mantencion, msg, selectData) => {
    return new Promise((resolve, reject) => {
        const [email, password] = emailByCity(user.nombre_comuna);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });

        let text = `Ha sido solicitada una mantención del cliente 

        ${user.nombre_cliente}
        nombre contacto:  ${user.nombre_contacto}
        Rut: ${user.rut_cliente}
        Teléfono:  ${user.telefono}
        Email:  ${user.email_cliente}
        Ciudad:  ${user.ciudad}
        Dirección:  ${user.direccion_factura}
        
        ${msg}

        Productos\n`;

        selectData.forEach(element => {
            text += `${element.label}\n`;
        });


        transporter.sendMail({
            from: email,
            to: user.email_cliente,
            subject: `Solicitud nueva mantencion ${mantencion}`,
            text: text

        })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err)
            })
    })
}