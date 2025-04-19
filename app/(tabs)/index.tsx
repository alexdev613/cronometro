import { useRef, useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';

export default function App() {
  const [numero, setNumero] = useState<string>("00:00:00"); // Tempo formatado exibido na tela
  const [botao, setBotao] = useState("VAI"); // Texto do botão principal: "VAI" ou "PARAR"
  const [ultimo, setUltimo] = useState<null | string>(null); // Armazena o último tempo registrado antes de zerar

  const [voltas, setVoltas] = useState<string[]>([]); // Estado para controle das voltas

  const [showModal, setShowModal] = useState(false);

  const [bloquearCronometro, setBloquearCronometro] = useState(false);

  // Refs armazenam valores entre renderizações sem causar re-render, ideal para controle interno como contadores ou timers
  const timer = useRef<NodeJS.Timeout | null>(null); // Armazena o ID do setInterval
  const ss = useRef(0);
  const mm = useRef(0);
  const hh = useRef(0);

  function vai() {
    if (bloquearCronometro) {
      alert("Você precisa limpar as voltas anteriores antes de iniciar uma nova contagem!");
      return; // para impedir a execução da função
    }

    if (timer.current !== null) {
      // Timer já está rodando: vamos parar ele
      clearInterval(timer.current);
      timer.current = null; // Marca como parado
      setBotao("VAI");

    } else {
      // Timer está parado: iniciamos o cronômetro
      timer.current = setInterval(() => {
        ss.current++;

        // Se segundos chegar a 60, zera e incrementa minutos
        if (ss.current === 60) {
          ss.current = 0;
          mm.current++;
        }

        // Se minutos chegar a 60, zera e incrementa horas
        if (mm.current === 60) {
          mm.current = 0;
          hh.current++;
        }

        // Formata o tempo como "hh:mm:ss", adicionando zero à esquerda quando necessário
        let format =
          (hh.current < 10 ? "0" + hh.current : hh.current) + ":" +
          (mm.current < 10 ? "0" + mm.current : mm.current) + ":" +
          (ss.current < 10 ? "0" + ss.current : ss.current);

        setNumero(format); // Atualiza a tela com o novo tempo

      }, 1000); // Executa a cada segundo

      setBotao("PARAR");
    }
  }

  function limpar() {
    // Se o timer estiver rodando, vamos parar ele
    if (timer.current !== null) {
      clearInterval(timer.current);
      timer.current = null;
    }

    /// Salva o tempo atual como "ultimo" antes de zerar o numero
    setUltimo(numero);
    // Zera o tempo na tela e os contadores
    setNumero("00:00:00");
    ss.current = 0;
    mm.current = 0;
    hh.current = 0;
    setBotao("VAI");

    if (voltas.length > 0) {
      setBloquearCronometro(true); // Ativa o bloqueio até que as voltas sejam apagadas
    }

  }

  function marcarVolta() {
    if (numero === "00:00:00") return; // Não faz nada se o tempo estiver zerado
    setVoltas((prev) => [numero, ...prev]); // Salva o tempo atual no início da lista
  }

  function limparVoltas() {
    // Só permite limpar voltas se o cronômetro estiver zerado e parado
    if (numero === "00:00:00" && timer.current === null) {
      setVoltas([]);
      setBloquearCronometro(false);
      setShowModal(false);
    }
  }

  return (
    <View style={styles.container}>

      <Image
        source={require("../../assets/images/crono.png")}
      />

      <Text style={styles.timer}> {numero} </Text>

      <View style={styles.btnArea}>
        <TouchableOpacity style={styles.btn} onPress={vai}>
          <Text style={styles.btnTexto}> {botao} </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={limpar}>
          <Text style={styles.btnTexto}>Zerar</Text>
        </TouchableOpacity>
      </View>

      {/* Renderização dos botões que controlam as voltas */}
      <View style={[styles.btnArea, { marginTop: 20 }]}>
        {voltas.length > 0 && numero === "00:00:00" && timer.current === null ? (
          <TouchableOpacity style={styles.btn} onPress={() => setShowModal(true)}>
            <Text style={styles.btnTexto}>Limpar Voltas </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, numero === "00:00:00" && { opacity: 0.5 }]}
            onPress={marcarVolta}
            disabled={numero === "00:00:00"}
          >
            <Text style={styles.btnTexto}>Volta</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Último tempo, quando a contagem terminou */}
      <View style={styles.areaUltima}>
        <Text style={styles.textoCorrida}>
          {ultimo ? "Último tempo: " + ultimo : ""}
        </Text>
      </View>

      {/* Listagem das voltas */}
      <ScrollView style={styles.voltasArea}>
        {voltas.map((tempo, index) => (
          <Text key={index} style={styles.voltaTexto}>
            Volta {voltas.length - index}: {tempo}
          </Text>
        ))}
      </ScrollView>

      {/* Modal */}
      {showModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalText}>Deseja realmente apagar todas as voltas?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={[styles.btn, { backgroundColor: "#CCC" }]}>
                <Text style={styles.btnTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={voltas.length === 0}
                onPress={limparVoltas}
                style={[styles.btn, { backgroundColor: voltas.length === 0 ? "#AAA" : "#FF4444" }]}
              >
                <Text style={styles.btnTexto}>Apagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00aeef"
  },
  timer: {
    marginTop: -160,
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF"
  },
  btnArea: {
    flexDirection: "row",
    marginTop: 130,
    height: 40
  },
  btn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    height: 40,
    margin: 17,
    borderRadius: 9
  },
  btnTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00aeef"
  },
  areaUltima: {
    marginTop: 40,
  },
  textoCorrida: {
    fontSize: 21,
    color: "#FFF",
    fontStyle: "italic"
  },
  voltasArea: {
    marginTop: 20,
    maxHeight: 100,
    width: "90%"
  },
  voltaTexto: {
    color: "#FFF",
    fontSize: 18,
    marginBottom: 5
  },
  // Estilos do Modal de confirmação:
  modalContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modal: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center"
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
});
