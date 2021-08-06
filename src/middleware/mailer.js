import nodemailer from 'nodemailer';


const emailByCity = (city) => {
    let email = "";
    let password = "";
    switch (city) {
        case "Coquimbo" || "La Serena":
            email = "avrojas@wilug.cl";
            password = "Totopipe11";
            break;
        case "Copiapo":
            email = "avrojas@wilug.cl";
            password = "Totopipe11";
            break;
        case "Santiago":
            email = "avrojas@wilug.cl";
            password = "Totopipe11";
            break;
        case "Calama":
            email = "avrojas@wilug.cl";
            password = "Totopipe11";
            break;
        default:
            email = "avrojas@wilug.cl";
            password = "Totopipe11";
            break;
    }

    return [email, password];
};

const getTransport = (comuna) => {

    const [email, pass] = comuna ? emailByCity(comuna) : ['avrojas@wilug.cl', 'Totopipe11'];

    const transport = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: email,
            pass: pass,
        }
    });

    return [transport, email];
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

export const sendMailWilug = (to) => {
    return new Promise((resolve, reject) => {
        const [transporter, emailSend] = getTransport();

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
        const [transporter, email] = getTransport(comuna);

        transporter.sendMail({
            from: email,
            to: to,
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
        const [transporter, email] = getTransport(user.nombre_comuna);

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
            to: email,
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
