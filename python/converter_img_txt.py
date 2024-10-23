#Open AI

import os
from rembg import remove
from PIL import Image
from deep_translator import GoogleTranslator
from g4f.client import Client

class Image_To_Text():

    def __init__(self, imagem):

        self.tradutor = GoogleTranslator(source= "en", target= "pt")
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = '.\Codigo\stellar-day-422521-j3-eb06e475a595.json'
        self.client = Client()
        self.input_path = imagem
        self.output_path = 'output.png'

    def detect_text(self, path):

        from google.cloud import vision

        client = vision.ImageAnnotatorClient()

        with open(path, "rb") as image_file:
            content = image_file.read()

        image = vision.Image(content=content)

        response = client.text_detection(image=image)
        texts = response.text_annotations

        li = []
        for text in texts:
            li.append(text.description)

        if response.error.message:
            raise Exception(
                "{}\nFor more info on error messages, check: "
                "https://cloud.google.com/apis/design/errors".format(response.error.message)
            )
        if len(li) != 0:
            return (True, ','.join(li))
        else:
            return (False)


    def localize_objects(self, path):

        from google.cloud import vision

        client = vision.ImageAnnotatorClient()

        with open(path, "rb") as image_file:
            content = image_file.read()
        image = vision.Image(content=content)

        objects = client.object_localization(image=image).localized_object_annotations

        if len(objects) != 0:
            return objects[0].name
        else:
            return "Objeto não identificado"


    def execute(self):
        input = self.input_path
        print("Passo 1 - Removendo Background")
        output = remove(input)
        output.save(self.output_path)
        print("Passo 2 - Localizando objeto(s)")
        obj = self.localize_objects(self.output_path)
        if obj == None:
            return {
                'erro': "Ocorreu um erro"
            }
        print("Passo 3 - Localizando texto(s)")
        textos = self.detect_text(self.output_path)
        print(obj, textos)

        print("Carregando")

        if textos != False:
            print("Validando textos")
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                 messages=[{"role": "user", "content": f'Considerando a seguinte descrição de objeto: {obj} e os seguintes textos localizados: {textos[1]}, qual seria o objeto descrito? Seja direto e traga apenas o que é o objeto no seguinte formato de texto: "O resultado é: OBJETO"'}]
            )
            os.system('cls')
            print(response.choices[0].message.content)
            if 'O resultado é:' not in response.choices[0].message.content:
                return f"O resultado é: {obj}"
            return response.choices[0].message.content
        else:
            print("No else: ")
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": f"Traduza '{obj}' para o portugues brasileiro. TRAGA APENAS A TRADUÇÃO SEM EXPLICAÇÕES."}]
            )
            os.system('cls')
            print(response.choices[0].message.content)
            print(f"O resultado é: {obj}")
            return f"O resultado é: {response.choices[0].message.content}"