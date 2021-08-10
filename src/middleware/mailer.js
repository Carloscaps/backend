import nodemailer from 'nodemailer';


const emailByCity = (city) => {
    let email = "wilugcorp@wilug.cl";
    let password = "Miractiva0101#";
    let email2 = "ventas@wilug.cl";
    switch (city) {
        case "Coquimbo" || "La Serena":
            email2 = "egarri@wilug.cl";
            break;
        case "Copiapo":
            email2 = "comercial@wilug.cl";
            break;
        case "Santiago":
            email2 = "comercial@wilug.cl";
            break;
        case "Calama":
            email2 = "rgarri@wilug.cl";
            break;
        default:
            email2 = "ventas@wilug.cl";
            break;
    }

    return [email, password, email2];
};

const getTransport = (comuna) => {

    //const [email, pass, email2] = comuna ? emailByCity(comuna) : ['wilugcorp@wilug.cl', 'Miractiva0101#', 'ventas@wilug.cl'];
    const [email, pass, email2] = emailByCity(comuna)

    const transport = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: email,
            pass: pass,
        }
    });

    return [transport, email, email2];
}


export const sendMail = (to) => {
    return new Promise((resolve, reject) => {
        const [transporter, emailSend] = getTransport();
        transporter.sendMail({
            from: emailSend,
            to: to,
            subject: "Solicitud Wilug",
            text: "Estimando cliente su solicitud fue recibia con exito, nos comunicaremos con usted para más información, atentamente Wilug",
        })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err)
            })
    })
};

export const sendMailWilug = (text, to, comuna) => {
    return new Promise((resolve, reject) => {
        const [transporter, email, , email2] = getTransport(comuna);

        transporter.sendMail({
            from: email,
            to: 'ventas@wilug.cl',
            subject: "Solicitud nuevo",
            text: `Acaba de llegar una nueva solicitud de parte del cliente: ${to}, msg: ${text}`,
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
        const [transporter, emailSend] = getTransport();

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
        const [transporter, email, email2] = getTransport(comuna);

        transporter.sendMail({
            from: email,
            to: email2,
            subject: "Contactenos",
            text: `Se acaba de poner en contacto el cliente: ${to}, msg: ${msg}`,
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
        const [transporter, email, email2] = getTransport(user.nombre_comuna);

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
            to: email2,
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
