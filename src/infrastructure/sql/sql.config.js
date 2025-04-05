import settings from '../../../appsettings.json';
import { Sequelize } from '@sequelize/core';
import { MsSqlDialect } from '@sequelize/mssql';

const sequelize = new Sequelize({
    dialect: MsSqlDialect,
    server: settings.sqlserver.server,
    port: settings.sqlserver.port,
    database: settings.sqlserver.database,
    authentication: {
        type: 'default',
        options: {
            userName: settings.sqlserver.username,
            password: settings.sqlserver.password
        },
    },
});

export default sequelize;