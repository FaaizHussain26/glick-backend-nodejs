import { Router } from 'express';
import { KnowledgeController } from '../controller/knowledge.controller';
import { fileupload } from '../middleware/upload.middleware';

const router = Router();

router.post('/upload', fileupload('uploads').single('file'), KnowledgeController.upload);
router.get('/', KnowledgeController.getAll);
router.get('/:id', KnowledgeController.getById);
router.put('/:id', fileupload('uploads').single('file'), KnowledgeController.update);
router.delete('/:id', KnowledgeController.delete);

export default router;
