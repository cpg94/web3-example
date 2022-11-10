import {
  Container,
  Title,
  Text,
  TextInput,
  Group,
  Space,
  Button,
} from "@mantine/core";
import { useEffect, useReducer, useState } from "react";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import { showNotification } from '@mantine/notifications';
import { useAuth } from "../context/Auth";
import Addresses from "../artifacts/addresses.json";
import Skill from "../artifacts/contracts/Skill.sol/Skill.json";

const formReducer = (state, action) => {
  switch (action.type) {
    case "setField": {
      return { ...state, [action.field]: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const fetchJson = async (link) => {
    const response = await fetch(link);
    return response.json()
}

export const Upload = () => {
  const {
    state: { address },
  } = useAuth();

  useEffect(() => {
    getAllTokens();
  }, []);

  
  const [formState, dispatch] = useReducer(formReducer, {
    name: "",
    currentEmployer: "",
  });

  const [allFiles, setAllFiles] = useState([])



  const getAllTokens = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(Addresses.Upload, Skill.abi, signer);

    const tokens = await contract.getAllTokens();

    const ipfsPaths = await Promise.all(
        tokens.map((token) => contract.getUri(token.toNumber()))
    );

    const allFileLinks = ipfsPaths.map((path) => `https://${path}.ipfs.w3s.link`)

    const json = await Promise.all(allFileLinks.map((link) => fetchJson(link)))

    setAllFiles(json)
  };

  const handleSubmitForm = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(Addresses.Upload, Skill.abi, signer);

    const json = JSON.stringify(formState);

    const blob = new Blob([json], { type: "application/json" });

    const auth =
      "Basic " +
      Buffer.from(
        "INFURA API KEY GOES HERE"
      ).toString("base64");
    const ipfs = create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });

    const added = await ipfs.add(blob);
    const cid = await added.cid.toV1().toString();

    showNotification({
        title: `Minting token at IPFS path ${cid}`,
    })

    await contract.mint(cid);

    contract.on('Minted', () => {
        showNotification({
            title: `Done!`,
        })

        getAllTokens()
    });
  };

  const handleOnFieldChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;

    dispatch({
      type: "setField",
      field,
      value,
    });
  };

  return (
    <Container>
      <Text>Connected via {address}</Text>


      <Space h="lg" />

      {!!allFiles.length && (
        <>
            <Title order={2}>Uploaded files.</Title>
            <Space h="lg" />

            {allFiles.map((file) => (
                <Group key={file.name + file.currentEmployer}>
                    <Text>Name: {file.name}</Text>
                    <Text>Employer: {file.currentEmployer}</Text>
                </Group>
            ))}
        </>
      )}

      <Space h="lg" />

      <>
        <Title order={2}>Create new skills.</Title>

        <Group grow>
            <TextInput
              placeholder="Name"
              name="name"
              onChange={handleOnFieldChange}
            />
            <TextInput
              placeholder="Current Employer"
              name="currentEmployer"
              onChange={handleOnFieldChange}
            />
        </Group>

        <Space h="lg" />

        <Group grow>
            <Button onClick={handleSubmitForm}>Save</Button>
        </Group>
      </>

    </Container>
  );
};
