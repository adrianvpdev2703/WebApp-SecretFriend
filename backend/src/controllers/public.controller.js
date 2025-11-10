const db = require("../models");

/**
 * @desc    Obtener info de un sorteo por el Link 1 (accessHash)
 * @route   GET /api/public/sorteo/:accessHash
 * @access  Público
 */
exports.getSorteoInfo = async (req, res) => {
    try {
        const { accessHash } = req.params;

        // 1. Buscar el sorteo por su hash
        const sorteo = await db.Sorteo.findOne({ where: { accessHash } });

        if (!sorteo || sorteo.status !== "iniciado") {
            return res.status(404).json({ error: "Sorteo no encontrado o no iniciado" });
        }

        // 2. Buscar participantes que NO se han identificado
        const participants = await db.Participant.findAll({
            where: {
                sorteoId: sorteo.id,
                isIdentified: false,
            },
            // MUY IMPORTANTE: Solo devolver los campos necesarios por seguridad
            attributes: ["id", "name"],
        });

        res.json({
            sorteoName: sorteo.name,
            participants,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener información del sorteo" });
    }
};

/**
 * @desc    Identificarse como participante (con Link 1)
 * @route   POST /api/public/sorteo/:accessHash
 * @access  Público
 */
exports.identifyParticipant = async (req, res) => {
    try {
        const { accessHash } = req.params;
        const { participantId } = req.body; // El ID del nombre en el que hizo clic

        // 1. Buscar el sorteo
        const sorteo = await db.Sorteo.findOne({ where: { accessHash } });
        if (!sorteo) {
            return res.status(404).json({ error: "Sorteo no encontrado" });
        }

        // 2. Buscar al participante
        const participant = await db.Participant.findOne({
            where: {
                id: participantId,
                sorteoId: sorteo.id,
            },
        });

        if (!participant) {
            return res.status(404).json({ error: "Participante no encontrado en este sorteo" });
        }

        // 3. Verificar si ya se identificó (por si acaso)
        if (participant.isIdentified) {
            return res.status(400).json({ error: "Este participante ya se ha identificado" });
        }

        // 4. Marcar como identificado y guardar
        participant.isIdentified = true;
        await participant.save();

        // 5. Devolver el Link 2 (personalHash)
        res.json({ personalHash: participant.personalHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al identificarse" });
    }
};

/**
 * @desc    Obtener datos del "Bolillo" (con Link 2 - personalHash)
 * @route   GET /api/public/bolillo/:personalHash
 * @access  Público
 */
exports.getBolillo = async (req, res) => {
    try {
        const { personalHash } = req.params;

        // 1. Buscar al participante (el dueño del link)
        const userParticipant = await db.Participant.findOne({
            where: { personalHash },
        });

        if (!userParticipant) {
            return res.status(404).json({ error: "Link de bolillo no válido" });
        }

        // 2. Buscar a la persona que le tocó regalar
        // (Esta es la magia de la relación 'assignedPerson' que definimos)
        const assignedParticipant = await db.Participant.findByPk(userParticipant.assignedPersonId);

        if (!assignedParticipant) {
            return res.status(500).json({ error: "Error al encontrar a la persona asignada" });
        }

        // 3. Devolver la información que React necesita
        res.json({
            myWishlist: userParticipant.wishlist || "",
            assignedPersonName: assignedParticipant.name,
            assignedPersonWishlist: assignedParticipant.wishlist || "",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el bolillo" });
    }
};

/**
 * @desc    Actualizar la wishlist (con Link 2 - personalHash)
 * @route   PUT /api/public/bolillo/:personalHash
 * @access  Público
 */
exports.updateWishlist = async (req, res) => {
    try {
        const { personalHash } = req.params;
        const { wishlist } = req.body;

        // 1. Buscar al participante por su link personal
        const participant = await db.Participant.findOne({
            where: { personalHash },
        });

        if (!participant) {
            return res.status(404).json({ error: "Link de bolillo no válido" });
        }

        // 2. Actualizar su wishlist
        participant.wishlist = wishlist;
        await participant.save();

        res.json({ message: "Wishlist actualizada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar la wishlist" });
    }
};
