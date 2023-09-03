const Router= require('router');
const multer= require('multer');
const { register, startRecording, saveVideoUrl } = require('../Controller/userHandle');

const router=Router();


router.post('/',register);

router.get('/',(req,res)=>{

    console.log("route hit");

    return res.send("Hello There");
})


router.get('/startRecording',startRecording);
router.post('/saveVideoUrl',saveVideoUrl);

module.exports=router;