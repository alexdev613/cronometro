import { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

// Variáveis dora do componente - elas não resetam entre renderizações
let timer: null | any = null; // Armazena o identificador do setInterval
let ss = 0; // Segundos
let mm = 0; // Minutos
let hh = 0; // Horas

export default function App() {
  const [numero, setNumero] = useState<string>("00:00:00"); // Estado que representa o tempo atual formatado
  const [botao, setBotao] = useState("VAI"); // Estado que controla botão principa ("VAI" ou "PARAR")
  const [ultimo, setUltimo] = useState<null | string | number>(null); // Estado que guarda o último tempo registrado ao limpar

  function vai() {
    // Se o timer já estiver rodando, interrompe ele
    if (timer !== null) {
      clearInterval(timer); // Para o setInterval
      timer = null; // Marca como parado
      setBotao("VAI");

    } else {
      // Se o timer não estiver rodando, começa a contagem
      timer = setInterval(() => {
        ss++;  // Incrementa segundos

        // Se segundos chear a 60, zera e incremeta minutos
        if (ss == 60) {
          ss = 0;
          mm++;
        }

        // Se minutos chegar a 60, zera e incrementa minutos
        if (mm == 60) {
          mm = 0;
          hh++;
        }

        // Formata o tempo em "hh:mm:ss" com zero à esquerda se cada variável de tempo for menor que 0
        let format =
          (hh < 10 ? "0" + hh : hh) + ":"
          + (mm < 10 ? "0" + mm : mm) + ":"
          + (ss < 10 ? "0" + ss : ss);

        setNumero(format); // Atualiza o estado com o tempo formatado

      }, 1000); // Executa a cada segundo

      setBotao("PARAR"); // Altera o texto do botão para "PARAR"
    }
  }

  function limpar() {
    // Para o timer, se estiver rodando
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }

    // Salva o último tempo no estado `ultimo` antes de resetar
    setUltimo(numero);

    // Reseta o tempo atual e as variáveis de controle
    setNumero("00:00:00");
    ss = 0;
    mm = 0;
    hh = 0;
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
