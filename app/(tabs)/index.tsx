import { useRef, useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function App() {
  const [numero, setNumero] = useState<string>("00:00:00"); // Tempo formatado exibido na tela
  const [botao, setBotao] = useState("VAI"); // Texto do botão principal: "VAI" ou "PARAR"
  const [ultimo, setUltimo] = useState<null | string>(null); // Armazena o último tempo registrado antes de zerar
  
  // Refs armazenam valores entre renderizações sem causar re-render, ideal para controle interno como contadores ou timers
  const timer = useRef<NodeJS.Timeout | null>(null); // Armazena o ID do setInterval
  const ss = useRef(0);
  const mm = useRef(0);
  const hh = useRef(0);

  function vai() {
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
          <Text style={styles.btnTexto}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.areaUltima}>
        <Text style={styles.textoCorrida}>
          {ultimo ? "Último tempo: " + ultimo : ""}
        </Text>
      </View>

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
  }
});
