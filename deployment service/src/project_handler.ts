/* once project is loaded into local space now build the project and run the server...


*/

import shell from "shelljs"

export default async function buildProject(projectId:string) {
    return new Promise<boolean>(resolve => {
        // run the script..
        const pwd = shell.exec(`bash ./run.sh ${projectId}`, function (code, stdout, stderr) {

            console.log('Exit code:', code);
            console.log('Program output:', stdout);
            console.log('Program stderr:', stderr);

            resolve(code === 0);
        });
    })

};