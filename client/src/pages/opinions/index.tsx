import { useState, useEffect } from "react";
import axios from "@/app/utils/axios";
import { connectToClient } from "@/app/utils/mqttClient";
import { Opinion } from "@/app/types/opinionTypes";
import { MainLayoutContainer } from "../components/main-layout";
import { OpinionForm } from "./opinion-form";
import { OpinionList } from "./opinion-list";
import "@/app/css/opinions-styles.css";


const OpinionsPage = () => {
  const [ opinions, setOpinions ] = useState<Opinion[]>([]);
  const [ averageRating, setAverageRating ] = useState<number>(0);

  useEffect(() => {
    const client = connectToClient();

    axios.get("/opinions/all").then(response => {
      setOpinions(response.data);
    });

    axios.get("/opinions/rating").then(response => {
      setAverageRating(response.data.rating);
    });

    const handleNewMessage = (topic: string, message: Buffer) => {

    if (topic === "opinions") {
      const newOpinion = JSON.parse(message.toString());

      if (!opinions.find(opinion => opinion.timestamp === newOpinion.timestamp)) {
        setOpinions(prevOpinions => [newOpinion, ...prevOpinions]);
      }
    } else if (topic === "opinions/rating") {
      const rating = JSON.parse(message.toString());
      setAverageRating(rating.rating);
    }
  };

  client.on("message", handleNewMessage);
  client.subscribe("opinions", { qos: 0 });
  client.subscribe("opinions/rating", { qos: 0 });

  return () => {
    client.off("message", handleNewMessage);
    client.unsubscribe("opinions");
    client.unsubscribe("opinions/rating");
  };

  }, []);

  return ( 
    <MainLayoutContainer>
      <div className="decor-frame">
        <OpinionForm />
        <OpinionList opinions={opinions} rating={averageRating} />
      </div>
    </MainLayoutContainer>

  );
}

export default OpinionsPage;