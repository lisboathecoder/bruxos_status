import dados from "../models/dados.js";
const { bruxos } = dados;

const getAllbruxos = (req, res) => {
  const { casa } = req.query;
  let resultado = bruxos;
  if (casa) {
    resultado = resultado.filter((b) =>
      b.casa.toLowerCase().includes(casa.toLowerCase())
    );
  }
  if (getAllbruxos) {
    res.status(200).json({
      total: resultado.length,
      data: resultado,
    });
  } else {
    res.status(500).json({
      status: 500,
      success: false,
      error: "INTERNAL_SERVER_ERROR",
      timestamp: new Date(),
    });
  }
};

const getBruxosById = (req, res) => {
  let id = req.params.id;
  id = parseInt(id);
  const bruxosId = bruxos.find((i) => i.id === id);

  if (bruxosId) {
    return res.status(200).json(bruxosId);
  } else if (!bruxosId) {
    res.status(404).json({
      status: 404,
      success: false,
      error: "WIZARD_NOT_FOUND",
      message: `Bruxo não encontrado com esse id: ${id}`,
    });
  };
};

const createBruxos = (req, res) => {
    const { nome, casa, ano, varinha, mascote, patrono, especialidade, vivo } = req.body;
    const casasNomes = ["Lufa-Lufa", "Corvinal", "Sonserina", "Grifinória"];

    if (!casa || !casasNomes.includes(casa)) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: "VALIDATION_ERROR",
            message: `O campo de casa é obrigatório e deve ser uma das opções: ${casasNomes.join(", ")}!`,
        });
    };

    if (varinha.length < 3) {
        return res.status(400).json({
            success: false,
            status: 400,
            error: "VALIDATION_ERROR",
            message: `O nome da varinha deve ter pelo menos 3 caracteres`,
        });
    };

    if (!nome || !casa || !mascote || !varinha || !patrono || !especialidade) {
        return res.status(400).json({
            success: false,
            status: 400,
            message: `Dados de criação inválidos!`,
            error: "VALIDATION_ERROR",
            details: {
                nome: "Nome do bruxo é obrigatório",
                casa: "Casa do bruxo é obrigatória",
                mascote: "Mascote do bruxo é obrigatório",
                varinha: "Varinha do bruxo é obrigatória",
                patrono: "Patrono do bruxo é obrigatório",
                especialidade: "Especialidade do bruxo é obrigatória",
            },
        });
    };

    if (bruxos.some((b) => b.nome === nome)) {
        return res.status(409).json({
            status: 409,
            success: false,
            message: "Esse bruxo já existe, não pode ter bruxos duplicados",
            suggest: "Crie o bruxo com outro nome!",
            error: "DUPLICATE_WIZARD",
        });
    };

    const novoBruxo = {
        id: bruxos.length + 1,
        nome,
        casa,
        ano: ano || new Date(),
        mascote,
        varinha,
        patrono,
        especialidade,
        vivo: vivo || true,
    };

    bruxos.push(novoBruxo);
    return res.status(201).json({
        status: 201,
        success: true,
        message: `Bruxo criado com sucesso!`,
        bruxo: novoBruxo,
    });
};

const deleteBruxo = (req, res) => {

    const { admin } = req.query;
    if (!admin || admin !== "true") {
        return res.status(403).json({
            status: 403,
            success: false,
            error: "FORBIDDEN",
            message: "Apenas administradores podem realizar essa ação.",
        });
    };

  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({
      status: 400,
      success: false,
      error: "INVALID_ID",
      message: `O id deve ser um número válido`,
    });
  };
  const bruxoRemove = bruxos.find((b) => b.id === id);
  if (!bruxoRemove) {
    res.status(404).json({
      status: 404,
      success: false,
      error: "WIZARD_NOT_FOUND",
      message: `Bruxo não encontrado com esse id: ${id}`,
    });
  };
  const bruxoFiltrado = bruxos.filter((b) => b.id !== id);
  bruxos.splice(0, bruxos.length, ...bruxoFiltrado);
  return res.status(200).json({
    success: true,
    message: `Bruxo removido com sucesso!`,
  });
};

const updateBruxo = (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, casa, ano, varinha, mascote, patrono, especialidade, vivo } =
    req.body;

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: `O id deve ser válido`,
    });
  }
  const bruxoExiste = bruxos.find((p) => p.id === id);
  if (!bruxoExiste) {
    return res.status(404).json({
      success: false,
      message: `Esse id não foi encontrado: ${id}`,
    });
  }
  const bruxoAtualizado = bruxos.map((bruxo) =>
    bruxo.id === id
      ? {
          ...bruxo,
          ...(nome && { nome }),
          ...(casa && { casa }),
          ...(ano && { ano }),
          ...(varinha && { varinha }),
          ...(mascote && { mascote }),
          ...(patrono && { patrono }),
          ...(especialidade && { especialidade }),
          ...(vivo && { vivo }),
        }
      : bruxo
  );

  bruxos.splice(0, bruxos.length, ...bruxoAtualizado);
  const bruxoEditado = bruxos.find((p) => p.id === id);

  return res.status(200).json({
    success: true,
    message: `bruxo editado com sucesso!`,
    bruxo: bruxoEditado,
  });
};

export { getAllbruxos, getBruxosById, createBruxos, deleteBruxo, updateBruxo };
