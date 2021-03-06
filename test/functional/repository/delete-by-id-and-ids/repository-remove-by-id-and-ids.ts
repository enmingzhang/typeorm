import "reflect-metadata";
import {expect} from "chai";
import {Connection} from "../../../../src/connection/Connection";
import {Post} from "./entity/Post";
import {createTestingConnections, reloadTestingDatabases, closeTestingConnections} from "../../../utils/test-utils";

describe("repository > removeById and removeByIds methods", function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchemaOnConnection: true
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------
    
    it("remove using removeById method should delete successfully", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const specificPostRepository = connection.getSpecificRepository(Post);

        // save a new posts
        const newPost1 = postRepository.create();
        newPost1.title = "Super post #1";
        const newPost2 = postRepository.create();
        newPost2.title = "Super post #2";
        const newPost3 = postRepository.create();
        newPost3.title = "Super post #3";
        const newPost4 = postRepository.create();
        newPost4.title = "Super post #4";

        await Promise.all([
            postRepository.persist(newPost1),
            postRepository.persist(newPost2),
            postRepository.persist(newPost3),
            postRepository.persist(newPost4)
        ]);

        // remove one
        await specificPostRepository.removeById(1);

        // load to check
        const loadedPosts = await postRepository.find();

        // assert
        loadedPosts.length.should.be.equal(3);
        expect(loadedPosts.find(p => p.id === 1)).to.be.empty;
        expect(loadedPosts.find(p => p.id === 2)).not.to.be.empty;
        expect(loadedPosts.find(p => p.id === 3)).not.to.be.empty;
        expect(loadedPosts.find(p => p.id === 4)).not.to.be.empty;
    })));

    it("remove using removeByIds method should delete successfully",  () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const specificPostRepository = connection.getSpecificRepository(Post);

        // save a new posts
        const newPost1 = postRepository.create();
        newPost1.title = "Super post #1";
        const newPost2 = postRepository.create();
        newPost2.title = "Super post #2";
        const newPost3 = postRepository.create();
        newPost3.title = "Super post #3";
        const newPost4 = postRepository.create();
        newPost4.title = "Super post #4";

        await Promise.all([
            postRepository.persist(newPost1),
            postRepository.persist(newPost2),
            postRepository.persist(newPost3),
            postRepository.persist(newPost4)
        ]);

        // remove multiple
        await specificPostRepository.removeByIds([2, 3]);

        // load to check
        const loadedPosts = await postRepository.find();

        // assert
        loadedPosts.length.should.be.equal(2);
        expect(loadedPosts.find(p => p.id === 1)).not.to.be.empty;
        expect(loadedPosts.find(p => p.id === 2)).to.be.empty;
        expect(loadedPosts.find(p => p.id === 3)).to.be.empty;
        expect(loadedPosts.find(p => p.id === 4)).not.to.be.empty;
    })));

});