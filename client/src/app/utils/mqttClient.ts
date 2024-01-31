import mqtt, { MqttClient } from "mqtt";


let client: MqttClient | undefined;

export const connectToClient = () => {
  if (!client) {
    client = mqtt.connect("ws://localhost:8000/mqtt");

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
    });

    client.on("disconnect", () => {
      console.log("Disconnected from MQTT broker");
    });

    client.on("error", (error) => {
      console.error(`MQTT error: ${error}`);
    });
  }

  return client;
}