let mysql=require('../../BD/mysql')//requerimos el archivo que contiene la conexion a la base de datos


//creamos varios modulos que interactuaran con la base de datos, en donde despues de la sentencia mysql
//se crea una funcion que nos indica si hubo errores o en caso contrario nos devolvera la informacion requerida

module.exports={

    //este controlador permite agregar reportes 
    agregar_reportes:(req,res)=>{

        //recibe por parametro la fecha de alta, el numero de habitacion, el tipo de incidencia, 
        //el estado del reporte, el area a la que pertenece
        //la fecha y hora para el estado del reporte, asi como "vacio" para los campos aun no llenados y 
        //"em_vacio" para los campos aun no llenados pero de tipo numerico en la bd
        let time =req.body.fecha;
        let num_room=req.body.num_room;
        let Incidencia=req.body.problema;
        let estado=req.body.estado;
        let area=req.body.area;
        let vacio='- - -';
        let em_vacio=0;
        let time_2=req.body.time_2;
        let observaciones=req.body.observaciones;
        let user_alta=req.body.user_alta;
        mysql.query(`insert into reportes_clientes (fecha_hora_report, numero_habitacion, problema, observaciones, estado, area, hora_alta, responsable,  hora_proceso, hora_cierre, hora_inconcluso, comentarios, nom_responsable_cierre,u_alta,u_proceso,u_cierre) values ('${time_2}', ${num_room},'${Incidencia}','${observaciones}','${estado}',${area},'${time}',${em_vacio},'${vacio}','${vacio}','${vacio}','${vacio}',${em_vacio},'${user_alta}','${vacio}','${vacio}')`, function(err,result,fields){
            if(err){
                res.json(err);
            }
            else{
                res.json(result);
            }
        })
    },

    //este controlador permite listar reportes de los clientes por area y que solo estan en estado "abierto"
    listar_reportes_area:(req,res)=>{

        //recibe por parametro el area 
        let area=req.params.area;
        mysql.query(`SELECT * FROM  reportes_clientes INNER JOIN areas_hotel ON  reportes_clientes.area = areas_hotel.id_area where estado='abierto' && id_area=${area}`, function(err,result,fields){
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        })

    },

    //este controlador puede asignar un empleado a un reporte 
    agregar_empleado_reporte:(req,res)=>{

        //recibe por parametro el id a modificar,el id del empleado, la fecha y hora, y el nuevo estatus
        let id_reporte=req.body.id_reporte;
        let empleado=req.body.id_empleado;
        let tiempo=req.body.tiempo;
        let estado=req.body.estatus;
        let user_process=req.body.user_process;
        mysql.query(`UPDATE reportes_clientes SET responsable = ${empleado}, estado='${estado}', hora_proceso='${tiempo}',u_proceso='${user_process}' WHERE id_report = ${id_reporte}`,function(err,result,fields){
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        })
    },

    //este controlador une las tablas reportes clientes, empleados y areas para mostrar toda la informacion posible.

    listar_reportes_areas:(req,res)=>{

        //recibe una sentencia que permite completar el condicional where
        
        let res_1=req.params.res;

        if(res_1=="todos"){

            mysql.query(`SELECT reportes_clientes.id_report, reportes_clientes.fecha_hora_report, reportes_clientes.numero_habitacion, 
            reportes_clientes.problema, reportes_clientes.observaciones ,areas_hotel.nombre_de_area, empleado_1.apellido_p, empleado_1.apellido_m, empleado_1.nombres, 
            reportes_clientes.estado,reportes_clientes.hora_alta,reportes_clientes.hora_proceso,
            reportes_clientes.hora_cierre,reportes_clientes.hora_inconcluso,reportes_clientes.comentarios, reportes_clientes.u_alta, reportes_clientes.u_proceso,reportes_clientes.u_cierre,
            empleado_2.apellido_p as cierr_p, empleado_2.apellido_m as cierr_m, empleado_2.nombres as cierr_n
            FROM (((reportes_clientes
            LEFT JOIN empleados as empleado_1 ON empleado_1.id_empleado= reportes_clientes.responsable)
            LEFT JOIN empleados as empleado_2 ON empleado_2.id_empleado=reportes_clientes.nom_responsable_cierre)
            INNER JOIN areas_hotel ON areas_hotel.id_area = reportes_clientes.area)`,function(err,result,fields){
                if(err){
                    res.json(err);
                }else{
                    res.json(result);
                }
            })


        }else{

            mysql.query(`SELECT reportes_clientes.id_report, reportes_clientes.fecha_hora_report, reportes_clientes.numero_habitacion, 
            reportes_clientes.problema, reportes_clientes.observaciones ,areas_hotel.nombre_de_area, empleado_1.apellido_p, empleado_1.apellido_m, empleado_1.nombres, 
            reportes_clientes.estado,reportes_clientes.hora_alta,reportes_clientes.hora_proceso,
            reportes_clientes.hora_cierre,reportes_clientes.hora_inconcluso,reportes_clientes.comentarios, reportes_clientes.u_alta, reportes_clientes.u_proceso,reportes_clientes.u_cierre,
            empleado_2.apellido_p as cierr_p, empleado_2.apellido_m as cierr_m, empleado_2.nombres as cierr_n
            FROM (((reportes_clientes
            LEFT JOIN empleados as empleado_1 ON empleado_1.id_empleado= reportes_clientes.responsable)
            LEFT JOIN empleados as empleado_2 ON empleado_2.id_empleado=reportes_clientes.nom_responsable_cierre)
            INNER JOIN areas_hotel ON areas_hotel.id_area = reportes_clientes.area) where ${res_1}`,function(err,result,fields){
                if(err){
                    res.json(err);
                }else{
                    res.json(result);
                }
            })


        }

            

        
        
    },

    //este controlador permite actualizar un reporte a cerrado o inconcluso

    cierre_reportes:(req,res)=>{

        //recibe por parametro un id del reporte, el estado, el id del empleado,comentarios y la fecha y hora de cierre o inconcluso

        let id=req.body.id_report;
        let estado_final=req.body.estado;
        let empleado=req.body.empleado;
        let comentarios=req.body.comentarios;
        let time=req.body.time;
        let user_end=req.body.user_end;

        //se crea una condicional en donde si el estado es "cerrado" se ejecuta sentencia
        if(estado_final=="Cerrado"){

            mysql.query(`UPDATE reportes_clientes SET estado = '${estado_final}', hora_cierre='${time}', hora_inconcluso='- - -',comentarios='${comentarios}',nom_responsable_cierre=${empleado},u_cierre='${user_end}' WHERE id_report = ${id}`,function(err,result,fields){
                if(err){
                    res.json(err);
                }else{
                    res.json(result);
                }
        })
        //en caso contrario se ejecutara la siguienbte sentencia
        }else if(estado_final=="Inconcluso"){

            mysql.query(`UPDATE reportes_clientes SET estado = '${estado_final}',hora_cierre='- - -',hora_inconcluso='${time}',comentarios='${comentarios}',nom_responsable_cierre=${empleado},u_cierre='${user_end}' WHERE id_report = ${id}`,function(err,result,fields){
                if(err){
                    res.json(err);
                }else{
                    res.json(result);
                }
        })

        }


    },

    obtener_folio:(req,res)=>{
        let condicion=req.params.condicion;
        mysql.query(`select reportes_clientes.id_report from reportes_clientes where ${condicion}`, function(err,result,fields){
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        })
    },


    obtener_reporte_folio:(req,res)=>{
        let condicion=req.params.condicion;

        mysql.query(`select fecha_hora_report, numero_habitacion, problema, observaciones, estado, comentarios from reportes_clientes where ${condicion}`, function(err,result,fields){
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        })
    },

    //este controlador permite listar reportes de los clientes por area 
    listar_reportes_area_reponsable:(req,res)=>{

        //recibe por parametro el area 
        let area=req.params.area;

        if(area=="todos"){

            mysql.query(`SELECT  reportes_clientes.id_report, reportes_clientes.numero_habitacion, 
            reportes_clientes.problema,  reportes_clientes.observaciones , areas_hotel.nombre_de_area,areas_hotel.id_area ,empleados.apellido_p, empleados.apellido_m, empleados.nombres, 
            reportes_clientes.estado
            FROM ((reportes_clientes
            INNER JOIN empleados ON reportes_clientes.responsable = empleados.id_empleado)
            INNER JOIN areas_hotel ON reportes_clientes.area = areas_hotel.id_area) where reportes_clientes.estado='En proceso'  order by areas_hotel.nombre_de_area `, function(err,result,fields){
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        })

        }else{

            mysql.query(`SELECT  reportes_clientes.id_report, reportes_clientes.numero_habitacion, 
            reportes_clientes.problema,  reportes_clientes.observaciones ,empleados.apellido_p, empleados.apellido_m, empleados.nombres
            FROM ((reportes_clientes
            INNER JOIN empleados ON reportes_clientes.responsable = empleados.id_empleado)
            INNER JOIN areas_hotel ON reportes_clientes.area = areas_hotel.id_area) where areas_hotel.id_area=${area} && reportes_clientes.estado='En proceso'`, function(err,result,fields){
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        })

        }
        

    },

    listar_all_reports_open:(req,res)=>{

        mysql.query(`SELECT * FROM  reportes_clientes INNER JOIN areas_hotel ON  reportes_clientes.area = areas_hotel.id_area where estado='abierto'`, function(err,result,fields){
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        })

    },

    validar_num_room:(req,res)=>{

        let num_room=req.params.num_room;

        mysql.query(`select count(numero_habitacion) as coincidencias from habitaciones where numero_habitacion=${num_room}`, function(err,result,fields){
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        })


    },

    validar_user_process:(req,res)=>{
        let id_reporte=req.params.id_reporte;

        mysql.query(`select u_proceso from reportes_clientes where id_report=${id_reporte}`,function(err,result,fields){
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        })



    },

    validar_user_end:(req,res)=>{
        let id_reporte=req.params.id_reporte;

        mysql.query(`select u_cierre from reportes_clientes where id_report=${id_reporte}`,function(err,result,fields){
            if(err){
                res.json(err);
            }else{
                res.json(result);
            }
        })



    }


}