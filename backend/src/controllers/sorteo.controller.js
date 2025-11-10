const db = require("../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

/**
 * @desc    Crear un nuevo sorteo
 * @route   POST /api/sorteos
 * @access  Privado (requiere token)
 */
exports.createSorteo = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { name, date, participants } = req.body;
        const ownerId = req.user.id;
        const newSorteo = await db.Sorteo.create({ name, date: date || null, ownerId }, { transaction: t });
        const participantsData = participants.map(participantName => ({
            name: participantName,
            sorteoId: newSorteo.id,
        }));
        await db.Participant.bulkCreate(participantsData, { transaction: t });
        await t.commit();
        const finalSorteo = await db.Sorteo.findByPk(newSorteo.id, {
            include: "participants",
        });
        res.status(201).json(finalSorteo);
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: "Error al crear el sorteo" });
    }
};

/**
 * @desc    Obtener todos los sorteos del usuario logueado
 * @route   GET /api/sorteos
 * @access  Privado (requiere token)
 */
exports.getMySorteos = async (req, res) => {
    // ... (Tu código de getMySorteos no cambia)
    try {
        const ownerId = req.user.id;
        const sorteos = await db.Sorteo.findAll({
            where: { ownerId },
            include: "participants",
            order: [["createdAt", "DESC"]],
        });
        res.json(sorteos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los sorteos" });
    }
};

// --- NUEVA FUNCIÓN AÑADIDA ---

/**
 * @desc    Actualizar un sorteo (nombre, fecha, participantes)
 * @route   PUT /api/sorteos/:id
 * @access  Privado (requiere token)
 */
exports.updateSorteo = async (req, res) => {
    // 1. Iniciar una transacción
    const t = await db.sequelize.transaction();

    try {
        // 2. Obtener los datos
        const ownerId = req.user.id;
        const sorteoId = req.params.id;
        const { name, date, participants } = req.body;

        // 3. Buscar el sorteo (dentro de la transacción)
        const sorteo = await db.Sorteo.findByPk(sorteoId, { transaction: t });

        // 4. Validaciones y permisos (Guard Clauses)
        if (!sorteo) {
            await t.rollback();
            return res.status(404).json({ error: "Sorteo no encontrado" });
        }
        if (sorteo.ownerId !== ownerId) {
            await t.rollback();
            return res.status(403).json({ error: "No autorizado para editar este sorteo" });
        }
        if (sorteo.status === "iniciado") {
            await t.rollback();
            return res.status(400).json({ error: "No se puede editar un sorteo que ya ha sido iniciado" });
        }
        // Validación de negocio (igual que al crear)
        if (!participants || participants.length < 2) {
            await t.rollback();
            return res.status(400).json({ error: "Se requieren al menos 2 participantes" });
        }

        // 5. Actualizar el Sorteo (nombre y fecha)
        sorteo.name = name;
        sorteo.date = date || null;
        await sorteo.save({ transaction: t });

        // 6. Borrar todos los participantes antiguos (dentro de la transacción)
        await db.Participant.destroy({
            where: { sorteoId: sorteo.id },
            transaction: t,
        });

        // 7. Preparar y crear los nuevos participantes (dentro de la transacción)
        const participantsData = participants.map(participantName => ({
            name: participantName,
            sorteoId: sorteo.id,
        }));
        await db.Participant.bulkCreate(participantsData, { transaction: t });

        // 8. Si todo salió bien, confirmar la transacción
        await t.commit();

        // 9. Responder con el sorteo actualizado
        const finalSorteo = await db.Sorteo.findByPk(sorteo.id, {
            include: "participants",
        });

        res.status(200).json(finalSorteo);
    } catch (error) {
        // 10. Si algo falló, revertir la transacción
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: error.message || "Error al actualizar el sorteo" });
    }
};

// --- FIN DE LA NUEVA FUNCIÓN ---

/**
 * @desc    Borrar un sorteo
 * @route   DELETE /api/sorteos/:id
 * @access  Privado (requiere token)
 */
exports.deleteSorteo = async (req, res) => {
    // ... (Tu código de deleteSorteo no cambia)
    try {
        const ownerId = req.user.id;
        const sorteoId = req.params.id;
        const sorteo = await db.Sorteo.findByPk(sorteoId);
        if (!sorteo) {
            return res.status(404).json({ error: "Sorteo no encontrado" });
        }
        if (sorteo.ownerId !== ownerId) {
            return res.status(403).json({ error: "No autorizado para borrar este sorteo" });
        }
        if (sorteo.status === "iniciado") {
            return res.status(400).json({ error: "No se puede borrar un sorteo que ya ha sido iniciado" });
        }
        await sorteo.destroy();
        res.status(200).json({ message: "Sorteo eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el sorteo" });
    }
};

/**
 * @desc    Iniciar un sorteo (Hacer la magia)
 * @route   POST /api/sorteos/:id/start
 * @access  Privado (requiere token)
 */
exports.startSorteo = async (req, res) => {
    // ... (Tu código de startSorteo no cambia)
    const t = await db.sequelize.transaction();
    try {
        const ownerId = req.user.id;
        const sorteoId = req.params.id;
        const sorteo = await db.Sorteo.findByPk(sorteoId, { transaction: t });
        if (!sorteo) {
            await t.rollback();
            return res.status(404).json({ error: "Sorteo no encontrado" });
        }
        if (sorteo.ownerId !== ownerId) {
            await t.rollback();
            return res.status(403).json({ error: "No autorizado" });
        }
        if (sorteo.status === "iniciado") {
            await t.rollback();
            return res.status(400).json({ error: "Este sorteo ya fue iniciado" });
        }
        const participants = await db.Participant.findAll({
            where: { sorteoId },
            transaction: t,
        });
        if (participants.length < 2) {
            await t.rollback();
            return res.status(400).json({ error: "Se necesitan al menos 2 participantes para sortear" });
        }
        let assignedIds = participants.map(p => p.id);
        for (let i = assignedIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [assignedIds[i], assignedIds[j]] = [assignedIds[j], assignedIds[i]];
        }
        for (let i = 0; i < participants.length; i++) {
            if (participants[i].id === assignedIds[i]) {
                const nextIndex = (i + 1) % participants.length;
                [assignedIds[i], assignedIds[nextIndex]] = [assignedIds[nextIndex], assignedIds[i]];
            }
        }
        if (participants.length === 2 && participants[0].id === assignedIds[0]) {
            [assignedIds[0], assignedIds[1]] = [assignedIds[1], assignedIds[0]];
        }
        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i];
            participant.assignedPersonId = assignedIds[i];
            participant.personalHash = uuidv4();
            await participant.save({ transaction: t });
        }
        sorteo.status = "iniciado";
        sorteo.accessHash = uuidv4();
        await sorteo.save({ transaction: t });
        await t.commit();
        res.json({ accessHash: sorteo.accessHash });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: "Error al iniciar el sorteo" });
    }
};
