import { Anchor, Flex, Text, Title } from "@mantine/core";

export default function AboutComponent() {
    return (
        <Flex direction={'column'} align={'flex-start'} justify={'flex-start'} m={'lg'} w={'80%'}>
            <Title mb={'xs'}>About</Title>
            <Text mb={'xs'} ta={'justify'}>This is a simple fusion tool for the New Moon server of the <Text span fs="italic">Shin Megami Tensei: IMAGINE Online</Text> MMO.</Text>
            <Text mb={'xs'} ta={'justify'}>I made this mostly because the regular <Anchor href="https://aqiu384.github.io/megaten-fusion-tool/smtim/demons">Imagine fusion tool</Anchor> is made for a vanilla server and doesn{`'`}t include the new demons from New Moon, and it uses localized names that are not reflected in-game, which makes working with it a bit annoying in some cases. Additionally, I noticed some fusion ranges were wrong in that tool, which I have corrected on this.</Text>
            <Text mb={'xs'} ta={'justify'}>This was made from scratch, I have not used any code from aqiu384{`'`}s tool. All the information used to make this came from the <Anchor href="https://wiki.megatenonline.ru/">imagine wiki</Anchor>, myself checking things in-game and in the game files, and some people helping out with things I couldn{`'`}t check myself.</Text>
            <Text mb={'xs'} ta={'justify'}>The purpose of this tool is simply to facilitate fusions. As such, I haven{`'`}t included any information that is not related to fusions, such as stats, affinities, skills, etc.</Text>
            <Text mb={'sm'} ta={'justify'}>I do not plan on implementing regular triple fusions on this tool. This decision is final. You should not use those unless you{`'`}re fusing a demon that requires it in the first place, in which case you don{`'`}t need a fusion tool. Honestly, the entire system is a mess and I{`'`}m not even sure if it works properly as intended.</Text>
            <Text mb={'xs'} ta={'justify'}>This is an open source project. The source code is available on <Anchor href="https://github.com/IuriTeixeira/NewMoon-Fusion-Tool">Github.</Anchor></Text>
            <Title mb={'xs'}>Contact Info</Title>
            <Text mb={'xs'} ta={'justify'}>If you have any suggestions or comments, or notice any bugs, feel free to tell me over at the New Moon discord, where I use the name Glorienn. There{`'`}s a thread for this tool under the #resources channel.</Text>
        </Flex>
    )
}