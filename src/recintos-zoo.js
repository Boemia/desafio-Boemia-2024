class RecintosZoo {
    constructor() {
        this.infoAnimais = {
            "LEAO": {tamanho: 3, biomas: ["savana"], carnivoro: true},
            "LEOPARDO": {tamanho: 2, biomas: ["savana"], carnivoro: true},
            "CROCODILO": {tamanho: 3, biomas: ["rio"], carnivoro: true},
            "MACACO": {tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false},
            "GAZELA": {tamanho: 2, biomas: ["savana"], carnivoro: false},
            "HIPOPOTAMO": {tamanho: 4, biomas: ["savana", "rio"], carnivoro: false},
        };

        this.recintos = [
            {numero: 1, bioma: "savana", tamanhoTotal: 10, animais: ["MACACO", "MACACO", "MACACO"]},
            {numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: []},
            {numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: ["GAZELA"]},
            {numero: 4, bioma: "rio", tamanhoTotal: 8, animais: []},
            {numero: 5, bioma: "savana", tamanhoTotal: 9, animais: ["LEAO"]}
        ];
    }

    analisaRecintos(animal, quantidade) {
        if (!(animal in this.infoAnimais)) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const informacaoAnimal = this.infoAnimais[animal];
        const ocupacao = informacaoAnimal.tamanho * quantidade;
        const biomasAdequados = informacaoAnimal.biomas;
        const carnivoro = informacaoAnimal.carnivoro;
        const recintosViaveis = [];

        this.recintos.forEach((recinto) => {
            // Verifica se o bioma do recinto é adequado
            if (!biomasAdequados.some(bioma => recinto.bioma.includes(bioma))) {
                return;
            }

            // Calcula a ocupação atual do recinto
            let ocupacaoAtual = recinto.animais.reduce((total, animal) => total + this.infoAnimais[animal].tamanho, 0);

            // Verifica se há mais de uma espécie no recinto e ajusta a ocupação
            const especiesUnicas = new Set(recinto.animais).size;
            if (especiesUnicas > 1) {
                ocupacaoAtual += 1; // Acrescenta 1 ao espaço ocupado
            }

            const espacoLivre = recinto.tamanhoTotal - ocupacaoAtual;

            // Verifica se há espaço suficiente
            if (espacoLivre < ocupacao) {
                return;
            }

            // Verifica se o recinto tem carnívoros e o animal atual não é carnívoro
            if (recinto.animais.some((a) => this.infoAnimais[a].carnivoro) && !carnivoro) {
                return;
            }

            // Verifica se o animal é carnívoro e há herbívoros no recinto
            if (carnivoro && recinto.animais.some((a) => !this.infoAnimais[a].carnivoro)) {
                return;
            }

            // Condição específica para hipopótamos
            if (animal === "HIPOPOTAMO" && !recinto.bioma.includes("rio")) {
                return;
            }

            // Verifica a alocação de macacos, que precisam de espaço extra se o recinto estiver vazio
            if (animal === "MACACO" && recinto.animais.length === 0 && espacoLivre < ocupacao + 1) {
                return;
            }

            // Adiciona o recinto à lista de viáveis
            recintosViaveis.push({
                numero: recinto.numero,
                espacoLivre: espacoLivre - ocupacao,
                tamanhoTotal: recinto.tamanhoTotal,
                descricao: `Recinto ${recinto.numero} (espaço livre: ${espacoLivre - ocupacao} total: ${recinto.tamanhoTotal})`
            });
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // Ordena os recintos viáveis por número
        recintosViaveis.sort((a, b) => a.numero - b.numero);
        return { recintosViaveis: recintosViaveis.map(recinto => recinto.descricao) };
    }
}

export { RecintosZoo as RecintosZoo };
