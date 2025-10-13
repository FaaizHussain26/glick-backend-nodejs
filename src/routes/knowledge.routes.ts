import { Router } from 'express';
import { KnowledgeController } from '../controller/knowledge.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/upload', upload.single('file'), KnowledgeController.upload);
router.get('/', KnowledgeController.getAll);
router.get('/:id', KnowledgeController.getById);
router.put('/:id', upload.single('file'), KnowledgeController.update);
router.delete('/:id', KnowledgeController.delete);

export default router;
